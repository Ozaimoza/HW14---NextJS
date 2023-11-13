// import { useRouter } from "next/router";
import DetailBook from "@/app/components/DetailBook";
import Navbar from "@/app/components/Navbar";

const Detail = ({ params }) => {
  return (
    <>
      <Navbar />

      <DetailBook params={params} />
    </>
  );
};

export default Detail;
