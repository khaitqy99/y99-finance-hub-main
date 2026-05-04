import { useParams, Navigate } from "react-router-dom";
import { loanProducts } from "@/data/loanProducts";
import LoanProductPage from "@/components/site/LoanProductPage";
import { useEffect } from "react";

const LoanProduct = () => {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? loanProducts[slug] : undefined;

  useEffect(() => {
    if (data) {
      document.title = `${data.name} | Y99 Finance`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", data.tagline);
    }
  }, [data]);

  if (!data) return <Navigate to="/404" replace />;

  return <LoanProductPage data={data} />;
};

export default LoanProduct;
