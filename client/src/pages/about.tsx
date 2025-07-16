import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardContent className="p-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-6">About Me</h1>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <p className="text-lg text-slate-600 mb-6">
                Hello! I'm a passionate web developer who loves sharing knowledge and insights about technology, programming, and the ever-evolving world of web development.
              </p>
              <p className="text-slate-700 mb-6">
                With over 5 years of experience in full-stack development, I've worked with various technologies including Node.js, React, Express, and many more. This blog is my way of documenting my journey, sharing tutorials, and connecting with fellow developers.
              </p>
              <p className="text-slate-700 mb-6">
                When I'm not coding, you can find me exploring new technologies, reading tech blogs, or working on open-source projects. I believe in the power of continuous learning and love to experiment with new tools and frameworks.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-slate-200 w-48 h-48 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="text-slate-500 text-6xl">👤</div>
              </div>
              <p className="text-slate-600 text-sm">Profile photo placeholder</p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Skills & Technologies</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3">Backend</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Node.js</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Express.js</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">MongoDB</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">PostgreSQL</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-3">Frontend</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">React</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">JavaScript</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Tailwind CSS</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">TypeScript</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
