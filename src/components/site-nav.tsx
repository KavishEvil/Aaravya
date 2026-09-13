"use client";

import Link from "next/link";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type ConditionGroup = {
  category: string;
  label: string;
  conditions: { slug: string; name: string }[];
};

type Doctor = { slug: string; name: string };

export function SiteNav({
  conditionGroups,
  doctors,
  phone,
}: {
  conditionGroups: ConditionGroup[];
  doctors: Doctor[];
  phone: string;
}) {
  return (
    <>
      {/* Desktop nav */}
      <NavigationMenu className="hidden lg:flex">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link href="/about" />} className="text-base">
              About Us
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-base">Treatments</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid grid-cols-4 gap-6 p-4 w-[860px]">
                {conditionGroups.map((group) => (
                  <div key={group.category}>
                    <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {group.label}
                    </p>
                    <ul className="flex flex-col gap-1">
                      {group.conditions.map((c) => (
                        <li key={c.slug}>
                          <NavigationMenuLink
                            render={<Link href={`/conditions/${c.slug}`} />}
                            className="!p-1.5 text-sm"
                          >
                            {c.name}
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link href="/gallery" />} className="text-base">
              Gallery
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link href="/faqs" />} className="text-base">
              FAQs
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link href="/testimonials" />} className="text-base">
              Testimonials
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink render={<Link href="/contact" />} className="text-base">
              Contact
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* Mobile nav */}
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="lg:hidden" />
          }
        >
          <Menu />
          <span className="sr-only">Open menu</span>
        </SheetTrigger>
        <SheetContent side="right" className="w-[85vw] overflow-y-auto p-0">
          <SheetHeader className="border-b border-border">
            <SheetTitle>Aaravya Hospital</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1 p-4 text-sm">
            <Link href="/about" className="rounded-lg p-2.5 hover:bg-accent">
              About Us
            </Link>
            <p className="mt-2 px-2.5 font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Treatments
            </p>
            {conditionGroups.map((group) => (
              <div key={group.category} className="mb-1">
                <p className="px-2.5 pt-2 text-xs font-medium text-muted-foreground">
                  {group.label}
                </p>
                {group.conditions.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/conditions/${c.slug}`}
                    className="block rounded-lg p-2.5 hover:bg-accent"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            ))}
            <Link href="/gallery" className="mt-2 rounded-lg p-2.5 hover:bg-accent">
              Gallery
            </Link>
            <Link href="/faqs" className="rounded-lg p-2.5 hover:bg-accent">
              FAQs
            </Link>
            <Link href="/testimonials" className="rounded-lg p-2.5 hover:bg-accent">
              Testimonials
            </Link>
            <Link href="/contact" className="rounded-lg p-2.5 hover:bg-accent">
              Contact
            </Link>
            {doctors.length > 0 && (
              <>
                <p className="mt-2 px-2.5 font-heading text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Our Doctors
                </p>
                {doctors.map((d) => (
                  <Link
                    key={d.slug}
                    href={`/doctors/${d.slug}`}
                    className="block rounded-lg p-2.5 hover:bg-accent"
                  >
                    {d.name}
                  </Link>
                ))}
              </>
            )}
          </nav>
          <div className="mt-auto border-t border-border p-4">
            <Button
              render={<a href={`tel:${phone}`} />}
              className="w-full bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <Phone className="mr-1.5" /> Call {phone}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
