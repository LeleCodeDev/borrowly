import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  Clock,
  FileText,
  Menu,
  Package,
  RotateCcw,
  ShieldCheck,
  Star,
  Store,
  Users,
  X,
  Zap,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import ButtonThemeSwitcher from "../components/ui/ButtonThemeSwitcher";
import { Separator } from "../components/ui/separator";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* ── NAVBAR ── */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "border-b bg-background/95 backdrop-blur shadow-sm"
            : "bg-background"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <Store className="w-5 h-5" />
            <span className="text-xl font-bold tracking-tight">Borrowly</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-foreground transition-colors"
            >
              How it works
            </a>
            <a
              href="#stats"
              className="hover:text-foreground transition-colors"
            >
              Why Borrowly
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ButtonThemeSwitcher />
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="font-medium hover:cursor-pointer"
              >
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className="font-medium hover:cursor-pointer gap-1.5"
              >
                Get Started <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ButtonThemeSwitcher />
            <button
              className="p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background px-6 py-4 flex flex-col gap-4">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it works
            </a>
            <a
              href="#stats"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Why Borrowly
            </a>
            <Separator />
            <div className="flex gap-3">
              <Link to="/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/register" className="flex-1">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-28">
        {/* Background orbs */}
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none -z-10" />

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-primary tracking-wide uppercase">
            Item Management Platform
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-7">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              Borrow what you need,{" "}
              <span className="text-primary relative">
                return when done.
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 300 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 6 Q75 0 150 4 Q225 8 300 2"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="text-primary/40"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              Borrowly streamlines item lending for organizations. Browse the
              catalog, submit requests, and track returns — all in one clean
              interface.
            </p>

            {/* Mini checklist */}
            <ul className="space-y-2">
              {[
                "Role-based access for admins, officers & borrowers",
                "Real-time item availability tracking",
                "Complete audit trail for every action",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Link to="/register">
                <Button
                  size="lg"
                  className="hover:cursor-pointer gap-2 w-full sm:w-auto text-base px-6"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  variant="outline"
                  size="lg"
                  className="hover:cursor-pointer w-full sm:w-auto gap-2 text-base px-6"
                >
                  See how it works <ChevronRight className="w-4 h-4" />
                </Button>
              </a>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-6 pt-2">
              {[
                { icon: Users, label: "500+ users" },
                { icon: Star, label: "4.9 rated" },
                { icon: Clock, label: "24/7 access" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                  <Icon className="w-3.5 h-3.5 text-primary" />
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — dashboard preview illustration */}
          <div className="hidden md:flex items-center justify-center relative">
            <div className="relative w-full max-w-sm">
              {/* Glow behind card */}
              <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-2xl scale-110 pointer-events-none" />

              {/* Mock dashboard card */}
              <div className="relative rounded-2xl border bg-card shadow-2xl overflow-hidden">
                {/* Card header */}
                <div className="bg-muted/40 border-b px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold">
                      Borrowly Dashboard
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-px bg-border">
                  {[
                    { label: "Items", val: "128", color: "text-blue-500" },
                    { label: "Active", val: "34", color: "text-emerald-500" },
                    { label: "Pending", val: "7", color: "text-amber-500" },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="bg-card px-3 py-3 text-center">
                      <p className={`text-xl font-bold ${color}`}>{val}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Item rows */}
                <div className="divide-y">
                  {[
                    {
                      name: "DSLR Camera",
                      cat: "Electronics",
                      status: "available",
                      qty: 3,
                    },
                    {
                      name: "Projector",
                      cat: "AV Equipment",
                      status: "borrowed",
                      qty: 0,
                    },
                    {
                      name: "Tripod Stand",
                      cat: "Photography",
                      status: "available",
                      qty: 5,
                    },
                    {
                      name: "Microphone",
                      cat: "Audio",
                      status: "available",
                      qty: 2,
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between px-4 py-2.5"
                    >
                      <div>
                        <p className="text-xs font-medium leading-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {item.cat}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.status === "available"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {item.status === "available"
                          ? `${item.qty} left`
                          : "Borrowed"}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA row */}
                <div className="px-4 py-3 bg-muted/20 border-t flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    4 of 128 items shown
                  </span>
                  <button className="text-xs text-primary font-semibold hover:underline">
                    View all →
                  </button>
                </div>
              </div>

              {/* Floating notification card */}
              <div className="absolute -bottom-4 -left-8 bg-card border rounded-xl shadow-lg px-3 py-2.5 flex items-center gap-2.5 w-52">
                <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold leading-tight">
                    Request approved!
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    DSLR Camera · just now
                  </p>
                </div>
              </div>

              {/* Floating user badge */}
              <div className="absolute -top-4 -right-4 bg-card border rounded-xl shadow-lg px-3 py-2 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
                  <Users className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[11px] font-semibold">500+ users</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGO STRIP ── */}
      <div className="border-y bg-muted/20 py-5">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 text-center mb-4">
            Trusted by organizations worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-40">
            {[
              "SMK Negeri 1",
              "Universitas ABC",
              "PT. TechCorp",
              "Dinas Pendidikan",
              "BUMN Institute",
            ].map((org) => (
              <span key={org} className="text-sm font-semibold text-foreground">
                {org}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3">
              Platform Features
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
              Everything you need to manage borrowing at scale.
            </h2>
          </div>
          <p className="text-muted-foreground text-base leading-relaxed md:pt-10">
            From item cataloging to return tracking, Borrowly gives admins,
            officers, and borrowers a unified workflow with role-based access.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {[
            {
              icon: Package,
              title: "Item Catalog",
              desc: "Organize items by category, track quantities, and display availability in real-time.",
              color: "blue",
            },
            {
              icon: FileText,
              title: "Borrow Requests",
              desc: "Borrowers submit requests in seconds. Officers review and approve from their dashboard.",
              color: "purple",
            },
            {
              icon: RotateCcw,
              title: "Return Tracking",
              desc: "Log returns, flag damages, and keep a complete audit trail for every item.",
              color: "emerald",
            },
            {
              icon: ShieldCheck,
              title: "Role-Based Access",
              desc: "Admins, officers, and borrowers each get a tailored view with the right permissions.",
              color: "orange",
            },
            {
              icon: BarChart3,
              title: "Activity Logs",
              desc: "Full history of every action taken — borrow, approve, return, and more.",
              color: "blue",
            },
            {
              icon: Zap,
              title: "Fast & Responsive",
              desc: "Built for speed. Instant search, debounced filters, and snappy pagination.",
              color: "purple",
            },
          ].map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="group rounded-2xl border bg-card p-6 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  color === "blue"
                    ? "bg-blue-50 dark:bg-blue-950/60"
                    : color === "purple"
                      ? "bg-purple-50 dark:bg-purple-950/60"
                      : color === "emerald"
                        ? "bg-emerald-50 dark:bg-emerald-950/60"
                        : "bg-orange-50 dark:bg-orange-950/60"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    color === "blue"
                      ? "text-blue-600 dark:text-blue-400"
                      : color === "purple"
                        ? "text-purple-600 dark:text-purple-400"
                        : color === "emerald"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-orange-600 dark:text-orange-400"
                  }`}
                />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1.5">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS — now correctly dark in dark mode ── */}
      <section
        id="how-it-works"
        className="bg-foreground text-background dark:bg-foreground dark:text-background"
      >
        <div className="max-w-6xl mx-auto px-6 py-24">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-background/50 mb-3">
            Steps
          </p>
          <h2 className="text-4xl font-extrabold tracking-tight mb-16 max-w-lg leading-tight text-background">
            Start borrowing in three simple steps.
          </h2>

          <div className="grid sm:grid-cols-3 gap-10">
            {[
              {
                num: "01",
                title: "Create your account",
                desc: "Sign up in under a minute. Your admin will assign your role — borrower or officer.",
              },
              {
                num: "02",
                title: "Browse the catalog",
                desc: "Search items, filter by category, check availability, and submit a borrow request.",
              },
              {
                num: "03",
                title: "Track & return",
                desc: "Monitor your active borrows, see due dates, and log returns when you're done.",
              },
            ].map(({ num, title, desc }, i) => (
              <div key={num} className="flex flex-col gap-5 group">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-black text-background/15 leading-none">
                    {num}
                  </span>
                  {i < 2 && (
                    <div className="hidden sm:block flex-1 h-px bg-background/15 mt-1" />
                  )}
                </div>
                <div className="w-9 h-px bg-primary" />
                <div>
                  <h3 className="font-bold text-base text-background mb-2">
                    {title}
                  </h3>
                  <p className="text-sm text-background/60 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORYSET ILLUSTRATION + STATS ── */}
      <section id="stats" className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Illustration from Storyset */}
          <div className="flex items-center justify-center">
            <img
              src="https://storyset.com/illustration/team-work/rafiki"
              alt="Team collaboration illustration"
              className="w-full max-w-sm"
            />
            {/* Fallback decorative element if image fails */}
            <div className="hidden w-full max-w-sm aspect-square rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 items-center justify-center">
              <Store className="w-24 h-24 text-primary/20" />
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3">
              Our Mission
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">
              We've helped hundreds of teams
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-10">
              Organizations of all types trust Borrowly to handle their
              day-to-day item lending with zero friction.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {[
                { val: "12k+", label: "Items tracked" },
                { val: "98%", label: "On-time returns" },
                { val: "10+", label: "Months live" },
              ].map(({ val, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <p className="text-3xl font-black tracking-tight text-primary">
                    {val}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="mt-10 rounded-2xl border bg-muted/30 p-5">
              <p className="text-sm text-foreground leading-relaxed italic mb-3">
                "Borrowly completely transformed how we manage lab equipment. No
                more spreadsheets, no more confusion."
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-xs">
                  A
                </div>
                <div>
                  <p className="text-xs font-semibold">Ahmad Fauzi</p>
                  <p className="text-[11px] text-muted-foreground">
                    Lab Coordinator, SMK Negeri 1
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROLES SECTION ── */}
      <section className="border-y bg-muted/20">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary mb-3">
              Three Roles, One Platform
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight">
              Built for everyone in your organization
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "Admin",
                icon: ShieldCheck,
                color: "orange",
                features: [
                  "Manage all users",
                  "Configure the system",
                  "View activity logs",
                  "Generate reports",
                ],
                desc: "Full control over the platform and all its data.",
              },
              {
                title: "Officer",
                icon: Users,
                color: "purple",
                features: [
                  "Approve/reject requests",
                  "Monitor returns",
                  "Manage items & categories",
                  "Track borrow status",
                ],
                desc: "Handles the day-to-day operations of the lending process.",
                featured: true,
              },
              {
                title: "Borrower",
                icon: Package,
                color: "blue",
                features: [
                  "Browse item catalog",
                  "Submit borrow requests",
                  "Track my borrows",
                  "Return items",
                ],
                desc: "A simple, intuitive experience for anyone borrowing items.",
              },
            ].map(({ title, icon: Icon, color, features, desc, featured }) => (
              <div
                key={title}
                className={`rounded-2xl border p-6 flex flex-col gap-5 transition-all duration-200 ${
                  featured
                    ? "bg-foreground text-background border-foreground shadow-xl scale-[1.02] dark:bg-foreground dark:text-background"
                    : "bg-card hover:shadow-md"
                }`}
              >
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    featured
                      ? "bg-background/15"
                      : color === "blue"
                        ? "bg-blue-50 dark:bg-blue-950/60"
                        : color === "purple"
                          ? "bg-purple-50 dark:bg-purple-950/60"
                          : "bg-orange-50 dark:bg-orange-950/60"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      featured
                        ? "text-background"
                        : color === "blue"
                          ? "text-blue-600 dark:text-blue-400"
                          : color === "purple"
                            ? "text-purple-600 dark:text-purple-400"
                            : "text-orange-600 dark:text-orange-400"
                    }`}
                  />
                </div>
                <div>
                  <h3
                    className={`font-extrabold text-xl mb-1 ${featured ? "text-background" : ""}`}
                  >
                    {title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${featured ? "text-background/60" : "text-muted-foreground"}`}
                  >
                    {desc}
                  </p>
                </div>
                <ul className="space-y-2 flex-1">
                  {features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-center gap-2 text-sm ${featured ? "text-background/80" : "text-muted-foreground"}`}
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 ${featured ? "text-background/60" : "text-primary"}`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA DARK BANNER ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="rounded-3xl bg-foreground dark:bg-foreground text-background dark:text-background p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/3 h-40 w-40 rounded-full bg-primary/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
            <div className="max-w-lg">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-background/40 mb-3">
                Get started now
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight text-background mb-3">
                Ready to simplify your borrowing process?
              </h2>
              <p className="text-background/60 text-base leading-relaxed">
                Join Borrowly today. No complex setup — just sign up and start
                managing your items in minutes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90 hover:cursor-pointer gap-2 w-full sm:w-auto text-base px-7"
                >
                  Get Started Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-background hover:text-background hover:bg-white/10 hover:cursor-pointer gap-1.5 w-full sm:w-auto text-base"
                >
                  Learn More <ChevronRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Store className="w-5 h-5" />
                <span className="font-extrabold text-xl">Borrowly</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
                Simple, powerful item borrowing management for modern teams.
              </p>
            </div>

            {[
              {
                title: "Platform",
                links: [
                  "Browse Items",
                  "Borrow Requests",
                  "Returns",
                  "Dashboard",
                ],
              },
              {
                title: "Roles",
                links: ["Borrower", "Officer", "Admin", "Sign Up"],
              },
              {
                title: "Company",
                links: ["About", "Contact", "Privacy", "Terms"],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-foreground mb-4">
                  {title}
                </p>
                <ul className="flex flex-col gap-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="mb-6" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              © 2025 Borrowly. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {["Twitter", "LinkedIn", "GitHub"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
