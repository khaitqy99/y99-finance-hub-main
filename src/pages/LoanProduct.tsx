import LoanProductPage from "@/components/site/LoanProductPage";
import { useCms } from "@/context/CmsContext";

type Props = {
  /** From getServerSideProps — router.query.slug is empty on first client paint */
  slug: string;
};

const LoanProduct = ({ slug }: Props) => {
  const { products } = useCms();
  const data = products[slug];

  if (!data) return null;

  return <LoanProductPage data={data} />;
};

export default LoanProduct;
