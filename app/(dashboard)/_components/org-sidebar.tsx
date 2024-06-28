"use client";

import { useState } from "react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import { useAction, useQuery } from "convex/react";
import { Banknote, LayoutDashboard, Star } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export const OrgSidebar = () => {
  const searchParams = useSearchParams();
  const favorites = searchParams.get("favorites");

  const { organization } = useOrganization();
  const isSubscribed = useQuery(api.subscriptions.getIsSubscribed, {
    orgId: organization?.id,
  });

  const portal = useAction(api.stripe.portal);
  const pay = useAction(api.stripe.pay);
  const [pending, setPending] = useState(false);

  const onClick = async () => {
    if (!organization?.id) return;

    setPending(true);

    try {
      const action = isSubscribed ? portal : pay;
      const redirectUrl = await action({ orgId: organization.id });

      window.location.href = redirectUrl;
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="hidden w-[206px] flex-col space-y-6 pl-5 pt-5 lg:flex">
      <Link href="/">
        <div className="flex items-center gap-x-2">
          <Image src="/logo.svg" alt="Logo" width={60} height={60} />
          <span className={cn("text-2xl font-semibold", font.className)}>
            Miro
          </span>
          {isSubscribed && <Badge variant="secondary">PRO</Badge>}
        </div>
      </Link>
      <OrganizationSwitcher
        hidePersonal
        appearance={{
          elements: {
            rootBox: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            },
            organizationSwitcherTrigger: {
              padding: "6px",
              width: "100%",
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              justifyContent: "space-between",
              backgroundColor: "white",
            },
          },
        }}
      />
      <div className="w-full space-y-1">
        <Button
          asChild
          size="lg"
          variant={favorites ? "ghost" : "secondary"}
          className="w-full justify-start px-2 font-normal"
        >
          <Link href="/">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Team boards
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant={favorites ? "secondary" : "ghost"}
          className="w-full justify-start px-2 font-normal"
        >
          <Link
            href={{
              pathname: "/",
              query: { favorites: true },
            }}
          >
            <Star className="mr-2 h-4 w-4" />
            Favorite boards
          </Link>
        </Button>
        <Button
          onClick={onClick}
          disabled={pending}
          variant="ghost"
          size="lg"
          className="w-full justify-start px-2 font-normal"
        >
          <Banknote className="mr-2 h-4 w-4" />
          {isSubscribed ? "Payment Settings" : "Upgrade"}
        </Button>
      </div>
    </div>
  );
};
