import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  pricingBasicDemoContent,
  type PricingBasicDemoContent,
} from "@/lib/demo-content";
import { cn } from "@/utilities/ui";

import { DemoLink } from "./DemoLink";

/* DEMO TWIN of payload-components/source/blocks/PricingBasic/Component.tsx
 * (pricing-basic@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions:
 *   <section className={cn('container', ...)}> -> <div> root (no landmark)
 *   <h2>                                      -> <div> (the catalog owns its outline)
 *   CMSLink                                   -> <DemoLink> (@/components/Link exists only in consumer repos)
 *   PricingBasicBlockData                     -> PricingBasicDemoContent (@/payload-types exists only in consumer repos)
 *   cn() inner wrappers                       -> plain mx-auto/max-w-6xl and plan-card conditionals
 * Badge/Card are the same shadcn primitives the component installs.
 * If the component Component.tsx changes, update this file in the same PR. */

export function PricingBasicDemo({
  className,
  content = pricingBasicDemoContent,
}: {
  className?: string;
  content?: PricingBasicDemoContent;
}) {
  const { description, eyebrow, plans, title } = content;

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="flex max-w-3xl flex-col gap-4">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
              {title}
            </div>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>

          {plans.length > 0 ? (
            <div className="grid min-w-0 gap-4 lg:grid-cols-3">
              {plans.map((plan, index) => {
                const link = plan.links?.[0]?.link;

                return (
                  <Card
                    key={`${plan.name}-${index}`}
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

                      {plan.features.length > 0 ? (
                        <ul className="mt-6 flex flex-col gap-3 border-t border-border/70 pt-6">
                          {plan.features.map((feature, featureIndex) => (
                            <li
                              className="flex min-w-0 items-start gap-3 text-sm leading-6 text-muted-foreground"
                              key={`${feature.text}-${featureIndex}`}
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
                          <DemoLink
                            appearance={link.appearance}
                            label={link.label}
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
    </div>
  );
}
