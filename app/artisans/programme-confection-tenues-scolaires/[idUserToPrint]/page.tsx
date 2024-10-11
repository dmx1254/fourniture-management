import UserPDFToPrint from "@/components/UserPDFToPrint";
import { getUserById } from "@/lib/actions/api";
import React from "react";

const UserPrint = async ({ params }: { params: { idUserToPrint: string } }) => {
  const userId = params.idUserToPrint;
  const user = await getUserById(userId);
//   console.log(user);
  return (
    <UserPDFToPrint user={user} />
  );
};

export default UserPrint;
