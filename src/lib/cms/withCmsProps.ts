import type { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { getCmsServerProps } from "@/lib/cms/serverProps";

type Props = Record<string, unknown>;

/**
 * Merges full CMS snapshot into getServerSideProps so layout/header match on SSR and hydration.
 */
export function withCmsProps<P extends Props>(
  handler?: (
    ctx: GetServerSidePropsContext,
    cms: Awaited<ReturnType<typeof getCmsServerProps>>,
  ) => Promise<GetServerSidePropsResult<P>> | GetServerSidePropsResult<P>,
): GetServerSideProps<P & { cmsInitial: Awaited<ReturnType<typeof getCmsServerProps>>["cmsInitial"] }> {
  return async (ctx) => {
    const cms = await getCmsServerProps();
    if (!handler) {
      return { props: { cmsInitial: cms.cmsInitial } as P & { cmsInitial: typeof cms.cmsInitial } };
    }
    const result = await handler(ctx, cms);
    if ("notFound" in result || "redirect" in result) return result;
    if (!("props" in result)) return result;
    const props = await Promise.resolve(result.props);
    return {
      props: {
        ...(props as P),
        cmsInitial: cms.cmsInitial,
      },
    };
  };
}
