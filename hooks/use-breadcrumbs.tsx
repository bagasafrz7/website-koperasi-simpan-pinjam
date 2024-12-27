'use client';

import { useParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

type RouteConfig = {
  pattern: string;
  breadcrumbs: BreadcrumbItem[];
};

export function useBreadcrumbs() {
  const pathname = usePathname();
  const params = useParams();
  const id =
    typeof params?.id === 'string' ? parseInt(params.id, 10) : undefined;
  const citiesId =
    typeof params?.citiesId === 'string'
      ? parseInt(params.citiesId, 10)
      : undefined;

  // Define routes with patterns that can match dynamic segments
  const routeConfigs: RouteConfig[] = [
    {
      pattern: '/dashboard',
      breadcrumbs: [{ title: 'Dashboard', link: '/dashboard' }]
    },
    {
      pattern: '/admin/master-data/wilayah/provinces',
      breadcrumbs: [
        { title: 'Dashboard', link: '/dashboard/overview' },
        { title: 'Wilayah', link: '/admin/master-data/wilayah/provinces' }
      ]
    },
    {
      pattern: '/admin/master-data/wilayah/city/:id',
      breadcrumbs: [
        { title: 'Dashboard', link: '/dashboard/overview' },
        { title: 'Provinsi', link: '/admin/master-data/wilayah/provinces' },
        { title: 'Kota', link: `/admin/master-data/wilayah/city/${id}` }
      ]
    },
    {
      pattern: '/admin/master-data/wilayah/subdistrict/:id',
      breadcrumbs: [
        { title: 'Dashboard', link: '/dashboard/overview' },
        { title: 'Provinsi', link: '/admin/master-data/wilayah/provinces' },
        {
          title: 'Kabupaten/Kota',
          link: `/admin/master-data/wilayah/city/${citiesId}`
        }
      ]
    }
  ];

  const breadcrumbs = useMemo(() => {
    // Function to match route patterns with dynamic segments
    const matchRoute = (pattern: string): boolean => {
      const patternSegments = pattern.split('/');
      const pathSegments = pathname.split('/');

      if (patternSegments.length !== pathSegments.length) return false;

      return patternSegments.every((segment, index) => {
        // Match dynamic segments (starting with :)
        if (segment.startsWith(':')) return true;
        return segment === pathSegments[index];
      });
    };

    // Find matching route configuration
    const matchedRoute = routeConfigs.find((config) =>
      matchRoute(config.pattern)
    );

    if (matchedRoute) {
      return matchedRoute.breadcrumbs;
    }

    // Fallback: generate breadcrumbs from pathname
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname, id]);

  return breadcrumbs;
}
