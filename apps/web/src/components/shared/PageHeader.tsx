import React from "react";
import { Breadcrumb } from "./Breadcrumb";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbItems?: { label: string; href?: string }[];
  showBackButton?: boolean;
  action?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  breadcrumbItems, 
  showBackButton = false,
  action 
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-8">
      {breadcrumbItems && breadcrumbItems.length > 0 && (
        <Breadcrumb items={breadcrumbItems} />
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button 
              variant="outline" 
              size="icon"
              className="h-9 w-9 rounded-full shrink-0" 
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1 text-sm md:text-base max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>
        
        {action && (
          <div className="shrink-0 flex items-center">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
