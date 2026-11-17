const PageBanner = ({ title, subtitle, icon }) => (
  <section className="page-banner">
    <div className="page-banner-inner">
      {icon && <span className="page-banner-icon">{icon}</span>}
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  </section>
);

export default PageBanner;
