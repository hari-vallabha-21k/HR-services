import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const stats = [
    { value: '500+', label: 'Happy Clients' },
    { value: '99%', label: 'Compliance Rate' },
    { value: '50+', label: 'Expert Advisors' },
    { value: '10Yrs', label: 'Experience' },
  ];

  const services = [
    {
      icon: 'receipt_long',
      title: 'GST Registration',
      description: 'End-to-end GST registration and monthly filing solutions for all business types.',
    },
    {
      icon: 'calculate',
      title: 'Income Tax Filing',
      description: 'Strategic tax planning and hassle-free ITR filing for individuals and corporations.',
    },
    {
      icon: 'corporate_fare',
      title: 'Company Setup',
      description: 'Incorporation services for Private Limited, LLP, and One Person Companies.',
    },
    {
      icon: 'payments',
      title: 'Payroll Management',
      description: 'Automated salary processing with integrated statutory deductions compliance.',
    },
    {
      icon: 'brand_awareness',
      title: 'Trademark Filing',
      description: 'Protect your brand identity with expert intellectual property registration services.',
    },
    {
      icon: 'fact_check',
      title: 'Audit Support',
      description: 'Comprehensive audit preparedness and year-round regulatory support.',
    },
    {
      icon: 'restaurant',
      title: 'FSSAI License',
      description: 'Food safety compliance and licensing for food business operators.',
    },
    {
      icon: 'groups',
      title: 'ESI & PF Return',
      description: 'Timely management of employee social security benefits and statutory returns.',
    },
    {
      icon: 'gavel',
      title: 'Professional Tax',
      description: 'State-wise professional tax compliance and periodic registration renewals.',
    },
    {
      icon: 'storefront',
      title: 'MSME Registration',
      description: 'Unlock government benefits and subsidies with Udyam registration.',
    },
    {
      icon: 'public',
      title: 'Import Export Code',
      description: 'Expand your horizons globally with mandatory IEC registration for trade.',
    },
    {
      icon: 'calendar_month',
      title: 'Annual Filing',
      description: 'Ensure ROC compliance with accurate annual return filings and documentation.',
    },
  ];

  const quickLinks = [
    { label: 'Home', href: '#' },
    { label: 'Our Services', href: '#services' },
    { label: 'Success Stories', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
  ];

  const footerServices = [
    { label: 'GST Registration', href: '#' },
    { label: 'Company Setup', href: '#' },
    { label: 'Tax Filing', href: '#' },
    { label: 'Payroll Management', href: '#' },
    { label: 'Compliance Audit', href: '#' },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-solid border-[#e7ebf4] dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-4 text-primary">
            <div className="size-8">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z"
                  fill="currentColor"
                />
                <path
                  clipRule="evenodd"
                  d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-[#0d121c] dark:text-white text-xl font-extrabold leading-tight tracking-[-0.015em]">
              HV Consultancy
            </h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <nav className="hidden md:flex items-center gap-9">
              <Link
                className="text-[#0d121c] dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors"
                to="/services"
              >
                Services
              </Link>
              <a
                className="text-[#0d121c] dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors"
                href="#"
              >
                About Us
              </a>
              <a
                className="text-[#0d121c] dark:text-slate-300 text-sm font-semibold hover:text-primary transition-colors"
                href="#"
              >
                Contact
              </a>
            </nav>
            <Link
              to="/services"
              className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold tracking-[0.015em] hover:bg-primary/90 transition-all"
            >
              <span>View Services</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="max-w-[1200px] mx-auto w-full px-6 py-16">
          <div className="flex flex-col gap-10 lg:flex-row items-center">
            <div className="flex flex-col gap-8 flex-1">
              <div className="flex flex-col gap-4 text-left">
                <h1 className="text-[#0d121c] dark:text-white text-4xl sm:text-5xl font-black leading-[1.1] tracking-[-0.033em] md:text-6xl">
                  Simplifying Statutory &amp; Compliance Services for Your Business
                </h1>
                <h2 className="text-slate-600 dark:text-slate-400 text-lg font-normal leading-relaxed max-w-[540px]">
                  Digital-First compliance management for startups and business owners. Get expert
                  guidance and ensure zero penalties with our tech-enabled advisory.
                </h2>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/services"
                  className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                  <span className="truncate">Browse Services</span>
                </Link>
                <Link
                  to="/login"
                  className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0d121c] dark:text-white text-base font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <span className="truncate">Login</span>
                </Link>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  <img
                    alt="Client"
                    className="size-10 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGjd8PtZWHj_9FIXUbPWfeRDvhVA9ccPeX-qtWf9i-FjVnO2O-QdPNCCrS7zYtU-QvydTJf-jMryY8GJeebUCnn47ORMQDeOT0E4-T-bZa2j30QhAhFhNRQ_gmK-AUaQ4Eil2VLNugOp3VN5UQDfdR37YbJQNvAv1jJcfrV-RHj9TAjB9Z74nC1QtW_nx-E3Y1Wc8X4G-qdTX5gPm4QMKFe5xPL8cOObOnFfpKmrs86Dso-rtLX4zySrR4fXzXt_rmGciJG1oy4_Q"
                  />
                  <img
                    alt="Client"
                    className="size-10 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKnCVNiMEOrBh81F9xy9M8zKZa_2chkpyFU0DXVOErk4TZX-hGTr9uluMlptWb1EE5lFkc8BsRQaRw5nK7o8bNFLra_DuQExs2J5e0JZJcAhq6Cr4PEUHsllUqELeJ0Yoo182uAmpxeKkY5P1VVmfhr4woHph8eFH331IT6m_lpraj-PDIdVHXQYBnoQ1UkNHJKV3-orvX-QC9dTpegnVUEOBCveGPYvKMQo4PkOIgas_tv_B4m46ZNiFy1JsTgvQoU9Zr669K2Mk"
                  />
                  <img
                    alt="Client"
                    className="size-10 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXJEE1mp927EjBiKdKcOGUJ52P3GtBkvBJgoMFlDaVysxtO1CMwcY5aDEwXOf1808o2SOpsogUpU61E1aMoAS6wZuid6tRN-9RL5IbTNiD3P5WQ9XqkoxhTgd8Ft-wewRfMElC9TVJngUyiMGuSMsohibkOhnK1AWA7p80HYGxgJp0_arhnllMrHuawg-qfixjagRqp95RdSrkZqXvDuyFnaxPOx9Jj7Ls-cX3oHFnI496bFRhzbBXXyh5ILEGS_q8SsfiNztcB-c"
                  />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Joined by 500+ successful startups
                </p>
              </div>
            </div>
            <div className="w-full flex-1">
              <div
                className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-3xl shadow-2xl overflow-hidden relative"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBoj6tEx4xkjfrjwoSsVj1E3n7ACDfXe5HYl2rzBDSp5K4T57k3Ca7ZXNLumWP0yLOASbFBb-GjBlfM57AW67vtPo727ak6l0f7VL0flWmPYB9ltGVHUrDsw75S2-tYNCdsVHgVCe6mTBEuOmjfs1ziLaiNhK663AiWKWCjzBloIzLvjqQ23tyhHHtk_eodu-9pCaZDPU2LxZQ4bY4I_M0Fh6Tqa_V7KylDazlcf9-6z2MHZOyvuRpFuYsE8Mu9aPFjoR-2lpA5mmY")',
                }}
              >
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-6 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      verified_user
                    </span>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">100% Compliant</p>
                      <p className="text-xs text-slate-500">Government authorized partner</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full bg-slate-900 dark:bg-slate-950 py-12">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-wrap justify-around gap-8">
              {stats.map((stat, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <p className="text-primary text-4xl font-black">{stat.value}</p>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="h-12 w-px bg-slate-800 hidden md:block"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section Header */}
        <section className="max-w-[1200px] mx-auto w-full px-6 pt-20" id="services">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-sm tracking-widest uppercase">
              Expert Solutions
            </span>
            <h2 className="text-[#0d121c] dark:text-white text-4xl font-bold leading-tight mt-2">
              Our Comprehensive Services
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Service Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {services.map((service, index) => (
              <div
                key={index}
                className="group flex flex-col gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined">{service.icon}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#0d121c] dark:text-white text-lg font-bold">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="w-full bg-slate-50 dark:bg-slate-900/20 py-20 border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                  What our clients say about us
                </h2>
                <div className="relative overflow-hidden group">
                  <div className="flex transition-transform duration-500">
                    <div className="w-full shrink-0">
                      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <div className="flex gap-1 text-yellow-400 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined fill-1">
                              star
                            </span>
                          ))}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 italic mb-6">
                          "HV Consultancy transformed how we handle our payroll. Their digital
                          platform is seamless, and their experts are always available to guide us
                          through complex tax filings."
                        </p>
                        <div className="flex items-center gap-3">
                          <div
                            className="size-12 rounded-full bg-slate-200"
                            style={{
                              backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6CN-gk1aGZyxuO0-UGVdK3r5fPglTL_Ym9iFdbMcOiVU_yvYB7jc3SZ_PWKogmd7mtMPPm91EgZw9h-9AkWVcDr7ue-O50Y8yEE2mDxr6ThxMPVR_JNKBpOJHZJNDtXQitM2lXw0U16yGYvy8QzBoxUoSTwdtLVR7w5hevlufSmfHushFh8SWtq4doRrM4ivmNS-6KN1OLWQXhKPskIX_jigr8AMXvRfafjeu1ATBfNWtKn5BBXVu9682odgA1nod7Enpc3dWmkE')",
                              backgroundSize: 'cover',
                            }}
                          ></div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">Rajesh Mehta</p>
                            <p className="text-xs text-slate-500">Founder, TechSprint Solutions</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div
                  className="aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 rotate-3 translate-y-4"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBl2Qi1O_wVyBrYaN_cZ-NZa6Kr43q8hJhkuURnN3WT3BblFT8lAabF_noyj7VAtQHy7q7orI4bFbwBMdlWIkB1-V0grdW7wbC48LjTOKr8nUidjYSYxBgWgT_mRKeTlCEuqqeo_P2KgC1bVUmlGZja7Or7jBmtSLuWd8bAL4nRU43PDy8j9e0xeczODuDafODujT-8mqAQPtXEE_xm4MFVKOhvBzfJcuz2u94oxMFuvLFBKBqMhZhDY0cAaIe3WgkB7o6u8og4IZw')",
                    backgroundSize: 'cover',
                  }}
                ></div>
                <div
                  className="aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-white dark:border-slate-800 -rotate-3"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_JlYexqLK9s13ViPWCIaj35hhFZ0h5H9gm4Bg2WckPhrxSQu9iXd56NQxWnGFxLCN7rEPxonsY7-Gb140XsTF7FhF_tLY_LTBtvDVZRMGnGcDdVz_A4KxhLJHkTmQrWYMMMFg5tqBN3GgwyCqX-6wz0n8DFJO_cfXvp4z2QMmgDc9E7lV8zA5PVjLo5Pui7sgHLhkGiH6RTA62-j2GyrN6HXFGO3IZ86h5yhNB9FDuyHuR8NFRLBIFwpkTqjD7ruGb4vgeWW9_lM')",
                    backgroundSize: 'cover',
                  }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA / Inquiry Section */}
        <section className="max-w-[1200px] mx-auto w-full px-6 py-20">
          <div className="bg-primary rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M47.5,-59.2C61.4,-51.1,72.4,-37.2,76.9,-21.8C81.4,-6.3,79.4,10.6,72.5,25.4C65.5,40.1,53.6,52.7,39.3,61.7C25.1,70.7,8.4,76.2,-8.1,75.1C-24.6,74,-40.8,66.3,-53.4,54.4C-66,42.5,-75,26.4,-77.8,9.1C-80.5,-8.3,-77.1,-26.8,-67,-41.3C-56.9,-55.8,-40.2,-66.2,-23.9,-70.6C-7.6,-75.1,8.3,-73.6,23.9,-70.6C39.5,-67.7,47.5,-59.2,47.5,-59.2Z"
                  fill="#FFFFFF"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
            <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  Ready to simplify your business compliance?
                </h2>
                <p className="text-blue-100 text-lg opacity-80 mb-8">
                  Talk to our experts today and get a personalized compliance roadmap for your
                  startup.
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-6">
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="material-symbols-outlined">call</span>
                    <span className="font-bold">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <span className="material-symbols-outlined">mail</span>
                    <span className="font-bold">support@hvconsultancy.com</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full max-w-md">
                <form className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col gap-4">
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Full Name"
                    type="text"
                  />
                  <input
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary focus:outline-none"
                    placeholder="Email Address"
                    type="email"
                  />
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 focus:ring-2 focus:ring-primary focus:outline-none">
                    <option>Select Service</option>
                    <option>GST Registration</option>
                    <option>Company Formation</option>
                    <option>Tax Planning</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    Request Callback
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-slate-900">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-white">
              <div className="size-6 bg-primary rounded"></div>
              <span className="text-xl font-black">HV Consultancy</span>
            </div>
            <p className="text-sm leading-relaxed">
              The digital-first compliance platform helping businesses scale without worrying about
              regulatory hurdles. Expert advice for modern founders.
            </p>
            <div className="flex gap-4">
              <a
                className="size-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                href="#"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a
                className="size-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                href="#"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                </svg>
              </a>
              <a
                className="size-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                href="#"
              >
                <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-4 text-sm">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a className="hover:text-primary transition-colors" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Services</h4>
            <ul className="flex flex-col gap-4 text-sm">
              {footerServices.map((service, index) => (
                <li key={index}>
                  <a className="hover:text-primary transition-colors" href={service.href}>
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-xs mb-4">
              Subscribe for monthly compliance updates and tax saving tips.
            </p>
            <div className="flex flex-col gap-2">
              <input
                className="bg-slate-900 border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-primary"
                placeholder="Email Address"
                type="email"
              />
              <button className="bg-primary text-white font-bold py-3 rounded-lg text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs">
          <p>© 2024 HV Consultancy Services Pvt Ltd. All rights reserved.</p>
          <div className="flex gap-8">
            <a className="hover:text-white transition-colors" href="#">
              Privacy Policy
            </a>
            <a className="hover:text-white transition-colors" href="#">
              Terms of Service
            </a>
            <a className="hover:text-white transition-colors" href="#">
              Refund Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
