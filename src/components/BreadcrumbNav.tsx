
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const BreadcrumbNav = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Custom titles for prettier display
  const getPageTitle = (path: string) => {
    const titles: { [key: string]: string } = {
      'how-it-works': 'How It Works',
      'pricing': 'Pricing',
      'about': 'About Us',
      'investor-leads': 'Investor Leads',
      'realtor-leads': 'Realtor Leads',
      'check-availability': 'Check Availability',
      'login': 'Login',
      'register': 'Register',
      'payment': 'Payment',
      'payment-success': 'Payment Success',
      'dashboard': 'Dashboard',
      'admin': 'Admin Dashboard',
    };
    
    return titles[path] || path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };
  
  // Don't show breadcrumb on homepage
  if (pathnames.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">
                  <Home className="h-4 w-4" />
                  <span className="sr-only">Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            
            {pathnames.map((path, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 1;
              
              return (
                <React.Fragment key={path}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{getPageTitle(path)}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={routeTo}>{getPageTitle(path)}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
};

export default BreadcrumbNav;
