import { Outlet } from "react-router-dom";
import AboutSidebar from "./AboutSidebar";

const AboutLayout = () => (
  <AboutSidebar>
    <Outlet />
  </AboutSidebar>
);

export default AboutLayout;
