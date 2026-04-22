import React from 'react';
import { useNavigate, useLocation, useParams, useSearchParams, NavigateFunction, Location } from 'react-router-dom';

export interface RouterProps {
  navigate: NavigateFunction;
  location: Location;
  params: Record<string, string | undefined>;
  searchParams: URLSearchParams;
  setSearchParams: (nextInit: URLSearchParamsInit, navigateOptions?: { replace?: boolean | undefined; state?: any } | undefined) => void;
}

type URLSearchParamsInit = string | string[][] | Record<string, string> | URLSearchParams;

export function withRouter<P extends RouterProps>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithRouterWrapper = (props: Omit<P, keyof RouterProps>) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    return (
      <WrappedComponent
        {...(props as P)}
        navigate={navigate}
        location={location}
        params={params}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    );
  };
  WithRouterWrapper.displayName = `withRouter(${WrappedComponent.displayName || WrappedComponent.name})`;
  return WithRouterWrapper;
}
