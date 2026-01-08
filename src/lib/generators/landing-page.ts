import fs from 'fs/promises';

/**
 * Generates a landing page that explains create-mvp-app and its features
 */
export async function generateLandingPage(brandName: string): Promise<void> {
  const landingPageContent = `import Navbar1 from "@/components/navbar1";
import Hero3 from "@/components/hero3";
import Feature13 from "@/components/feature13";
import Feature51 from "@/components/feature51";
import Feature72 from "@/components/feature72";
import Testimonial10 from "@/components/testimonial10";
import Cta11 from "@/components/cta11";
import Footer2 from "@/components/footer2";

export default function Home() {
  const brandName = "${brandName}";
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar1
        logo={{
          url: "/",
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
          alt: brandName,
          title: brandName,
        }}
        menu={[
          {
            title: "Features",
            url: "#features",
          },
          {
            title: "Components",
            url: "#components",
          },
          {
            title: "Tech Stack",
            url: "#tech-stack",
          },
        ]}
        auth={{
          login: {
            title: "Documentation",
            url: "https://github.com/riprayt/create-mvp-app",
          },
          signup: {
            title: "Get Started",
            url: "#get-started",
          },
        }}
      />
      
      <Hero3
        badge="Built with Create MVP App 🚀"
        title={\`Welcome to \${brandName}\`}
        description="This project was created with create-mvp-app - a production-ready Next.js starter with authentication, database, 90+ UI components, and everything you need to ship your MVP in minutes."
        primaryAction={{
          text: "Start Building",
          url: "#features",
        }}
        secondaryAction={{
          text: "View on GitHub",
          url: "https://github.com/riprayt/create-mvp-app",
        }}
      />
      
      <div id="features">
        <Feature13
          heading="Everything Included Out of the Box"
          subheading="What's Inside"
          description="Your project comes pre-configured with all the essentials for building a modern web application. No setup required - just start coding!"
        />
      </div>
      
      <div id="components">
        <Feature72
          badge="90+ Components"
          heading="Beautiful UI Components Ready to Use"
          description="This landing page is built with Shadcn Blocks - production-ready components you can customize. Check out Navbar, Hero, Features, Testimonials, CTA, and Footer components above and below."
        />
      </div>
      
      <div id="tech-stack">
        <Feature51
          heading="Modern Tech Stack"
          subheading="Technology"
          description="Built with the latest and greatest tools for web development."
        />
      </div>
      
      <div id="testimonials">
        <Testimonial10
          heading="What This Template Gives You"
          subheading="Features"
          description="Real developers shipping faster with production-ready infrastructure"
        />
      </div>
      
      <Cta11
        heading="Ready to Build Your MVP?"
        description={\`Start customizing \${brandName} and ship your product faster. All components are fully customizable and production-ready.\`}
        primaryAction={{
          text: "Read the Docs",
          url: "https://github.com/riprayt/create-mvp-app",
        }}
        secondaryAction={{
          text: "Explore Components",
          url: "#components",
        }}
      />
      
      <Footer2
        logo={{
          url: "/",
          src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
          alt: brandName,
          title: brandName,
        }}
        tagline="Created with create-mvp-app - Ship your MVP in minutes, not weeks."
        menuItems={[
          {
            title: "Get Started",
            links: [
              { text: "Documentation", url: "https://github.com/riprayt/create-mvp-app" },
              { text: "Features", url: "#features" },
              { text: "Components", url: "#components" },
            ],
          },
          {
            title: "Resources",
            links: [
              { text: "Next.js Docs", url: "https://nextjs.org/docs" },
              { text: "Shadcn UI", url: "https://ui.shadcn.com" },
              { text: "Tailwind CSS", url: "https://tailwindcss.com" },
            ],
          },
          {
            title: "Tools Included",
            links: [
              { text: "Clerk Auth", url: "https://clerk.com" },
              { text: "Supabase", url: "https://supabase.com" },
              { text: "Vercel", url: "https://vercel.com" },
            ],
          },
        ]}
        copyright={\`© \${new Date().getFullYear()} \${brandName}. Created with create-mvp-app.\`}
        bottomLinks={[
          { text: "GitHub", url: "https://github.com/riprayt/create-mvp-app" },
          { text: "Report Issue", url: "https://github.com/riprayt/create-mvp-app/issues" },
        ]}
      />
    </div>
  );
}
`;

  await fs.writeFile('src/app/page.tsx', landingPageContent);
}
