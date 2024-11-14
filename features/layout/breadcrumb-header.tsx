"use client";
import { usePathname } from "next/navigation";
import React, { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "../../components/ui/breadcrumb";
import Link from "next/link";
import { MobileSidebar } from "./sidebars/mobile-sidebar";

export const BreadcrumbHeader = () => {
  const pathname = usePathname();
  const paths = pathname === "/" ? [""] : pathname.split("/");
  return (
    <div className="flex items-center flex-start">
      <MobileSidebar />
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => (
            <Fragment key={index}>
              <BreadcrumbItem />
              <BreadcrumbLink className="capitalize" asChild>
                <Link href={`/${path}`}>{path === "" ? "home" : path}</Link>
              </BreadcrumbLink>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
