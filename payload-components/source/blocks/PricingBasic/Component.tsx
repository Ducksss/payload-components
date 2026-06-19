import React from "react";

import type { PricingBasicBlock as PricingBasicBlockData } from "@/payload-types";

import { CMSLink } from "@/components/Link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/utilities/ui";

type Props = PricingBasicBlockData & {
  id?: string;
  className?: string;
  disableInnerContainer?: boolean;
};

export const PricingBasicBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  plans,
  title,
}) => {
  return (
    <section
      className={cn("container", className)}
      id={id ? `block-${id}` : undefined}
    >
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn("flex flex-col gap-8", {
            "mx-auto max-w-6xl": !disableInnerContainer,
          })}
        >
          <div className="flex max-w-3xl flex-col gap-4">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
              {title}
            </h2>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>

          {plans && plans.length > 0 ? (
            <div className="grid min-w-0 gap-4 lg:grid-cols-3">
              {plans.map((plan, index) => {
                const link = plan.links?.[0]?.link;

                return (
                  <Card
                    key={plan.id ?? `${plan.name}-${index}`}
                    className={cn(
                      "flex min-w-0 flex-col border-border/70 bg-background/85 shadow-none",
                      {
                        "border-primary/50 bg-primary/5 shadow-sm":
                          plan.highlighted,
                      },
                    )}
                  >
                    <CardHeader className="gap-4 p-5">
                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <CardTitle className="min-w-0 break-words text-2xl tracking-title">
                          {plan.name}
                        </CardTitle>
                        {plan.highlighted ? (
                          <Badge className="shrink-0 rounded-full px-3 py-1 uppercase tracking-eyebrow">
                            Featured
                          </Badge>
                        ) : null}
                      </div>

                      {plan.description ? (
                        <CardDescription className="text-sm leading-6 text-muted-foreground">
                          {plan.description}
                        </CardDescription>
                      ) : null}
                    </CardHeader>

                    <CardContent className="flex min-w-0 flex-1 flex-col p-5 pt-0">
                      <div className="min-w-0">
                        <p className="break-words text-4xl font-medium tracking-display sm:text-5xl">
                          {plan.price}
                        </p>
                        {plan.billingNote ? (
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {plan.billingNote}
                          </p>
                        ) : null}
                      </div>

                      {plan.features && plan.features.length > 0 ? (
                        <ul className="mt-6 flex flex-col gap-3 border-t border-border/70 pt-6">
                          {plan.features.map((feature, featureIndex) => (
                            <li
                              className="flex min-w-0 items-start gap-3 text-sm leading-6 text-muted-foreground"
                              key={
                                feature.id ?? `${feature.text}-${featureIndex}`
                              }
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                              />
                              <span className="min-w-0 break-words">
                                {feature.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : null}

                      {link ? (
                        <div className="mt-auto pt-6">
                          <CMSLink
                            appearance={
                              link.appearance === "outline"
                                ? "outline"
                                : "default"
                            }
                            {...link}
                          />
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
