'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/utilities/ui'
import { ArrowUpRight } from 'lucide-react'

import { kitCategories } from './content'
import styles from './landing.module.css'

export const KitCatalog = () => {
  return (
    <Tabs className="flex flex-col gap-8" defaultValue={kitCategories[0]?.value}>
      <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-[1.5rem] bg-transparent p-0">
        {kitCategories.map((category) => (
          <TabsTrigger
            key={category.value}
            value={category.value}
            className="rounded-full border border-border/80 bg-background px-3.5 py-2 text-sm data-[state=active]:border-foreground/10 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-none sm:px-4"
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {kitCategories.map((category) => (
        <TabsContent key={category.value} value={category.value} className="mt-0">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="rounded-[1.75rem] border border-border/70 bg-background/65 p-6 backdrop-blur-sm">
              <Badge
                variant="outline"
                className="rounded-full px-3 py-1 text-[0.72rem] uppercase tracking-[0.18em]"
              >
                {category.label}
              </Badge>
              <h3 className="mt-5 text-3xl font-medium tracking-[-0.05em]">
                Curated kits that feel native to Payload.
              </h3>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                {category.description}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {category.kits.map((kit) => (
                <Card
                  key={kit.name}
                  className={cn(
                    styles.panelLift,
                    'rounded-[1.5rem] border-border/70 bg-background/78 shadow-none',
                  )}
                >
                  <CardHeader className="gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-2xl tracking-[-0.05em]">{kit.name}</CardTitle>
                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                    </div>
                    <CardDescription className="text-base leading-7">
                      {kit.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-wrap gap-2">
                    {kit.includes.map((item) => (
                      <Badge key={item} variant="outline" className="rounded-full px-3 py-1">
                        {item}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
