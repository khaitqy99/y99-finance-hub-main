import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef } from "react";
import type { ComponentProps } from "react";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<ComponentProps<typeof Link>, "className"> {
  className?: string | ((state: { isActive: boolean; isPending: boolean }) => string);
  activeClassName?: string;
  pendingClassName?: string;
  exact?: boolean;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, href, exact = false, ...props }, ref) => {
    const router = useRouter();
    const mounted = useMounted();
    const currentPath = router.asPath.split("?")[0];
    const targetPath = typeof href === "string" ? href : href.pathname ?? "";
    const isActive =
      mounted &&
      (exact
        ? currentPath === targetPath
        : currentPath === targetPath || currentPath.startsWith(`${targetPath}/`));

    const computedClassName =
      typeof className === "function"
        ? className({ isActive, isPending: false })
        : cn(className, isActive && activeClassName);

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(computedClassName, pendingClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
