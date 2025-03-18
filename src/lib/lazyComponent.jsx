import { Suspense } from "react";
import Loading from "../components/Loading/loading";

export const LazyComponent = (props) => {
  const Component = props.component;
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};
