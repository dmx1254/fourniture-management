import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';
import iconv from 'iconv-lite';

interface SearchResult {
  title: string;
  publishDate: string;
  deadline: string;
  id: string;
}

export async function GET(req: Request) {
  try {
    // Construire l'URL avec le terme de recherche
    const searchUrl = 'http://www.marchespublics.sn/index.php?option=com_soffres&Itemid=143';
    
    // Faire la requête POST avec les paramètres de recherche
    const response = await axios.post(searchUrl, 
      new URLSearchParams({
        'crit': 'entretiens',
        'who': 'mysearch'
      }), 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'arraybuffer'
      }
    );

    // Décoder la réponse avec le bon encodage
    const html = iconv.decode(response.data, 'ISO-8859-1');
    
    // Charger le HTML dans Cheerio avec les bonnes options
    const $ = cheerio.load(html, {
      xml: {
        decodeEntities: false
      },
      _useHtmlParser2: true
    } as cheerio.CheerioOptions);

    const results: SearchResult[] = [];

    // Trouver la table des résultats
    $('.cooltable tr').each((index, element) => {
      // Ignorer l'en-tête de la table
      if (!$(element).hasClass('cooltablehdr')) {
        const columns = $(element).find('td');
        
        if (columns.length >= 3) {
          const title = $(columns[0]).text().trim();
          const publishDate = $(columns[1]).text().trim();
          const deadline = $(columns[2]).text().trim();
          
          // Extraire l'ID du lien détails
          const detailsLink = $(columns[3]).find('a').attr('href') || '';
          const idMatch = detailsLink.match(/idmarket=(\d+)/);
          const id = idMatch ? idMatch[1] : '';

          if (title && publishDate && deadline) {
            results.push({
              title,
              publishDate,
              deadline,
              id
            });
          }
        }
      }
    });

    // Extraire le nombre total de résultats
    const totalResults = $('.Style4')
      .text()
      .match(/(\d+)\s+résultat/)?.[1] || '0';

    return NextResponse.json({
      success: true,
      total: parseInt(totalResults),
      count: results.length,
      data: results
    });

  } catch (error) {
    console.error('Erreur lors du scraping:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
    }, { status: 500 });
  }
}