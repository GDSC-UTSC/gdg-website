"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Circle } from "lucide-react"

const RecruitmentSection = () => {
  const positions = [
    {
      title: "Core Team Member",
      description: "Help organize events, manage community outreach, and shape the future of GDG @ UTSC.",
      requirements: ["Passionate about technology", "Strong communication skills", "Leadership potential"],
      commitment: "5-8 hours/week",
    },
    {
      title: "Technical Lead",
      description: "Lead workshops, mentor junior developers, and contribute to technical content creation.",
      requirements: ["Strong programming skills", "Experience with Google technologies", "Teaching ability"],
      commitment: "8-12 hours/week",
    },
    {
      title: "Event Coordinator",
      description: "Plan and execute engaging events, manage logistics, and ensure memorable experiences.",
      requirements: ["Event planning experience", "Detail-oriented", "Creative thinking"],
      commitment: "6-10 hours/week",
    },
  ]

  const benefits = [
    "Google swag and exclusive merchandise",
    "Access to Google Cloud credits and resources",
    "Networking opportunities with industry professionals",
    "Leadership and professional development",
    "Certificate of participation and recognition",
    "Priority access to Google events and programs",
  ]

  return (
    <section id="recruitment" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Team</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to make an impact? We&apos;re looking for passionate students who want to contribute to UTSC&apos;s
            tech community and grow their skills along the way.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {positions.map((position, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{position.title}</CardTitle>
                  <p className="text-sm text-primary font-medium">{position.commitment}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{position.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Requirements:</h4>
                    <ul className="space-y-1">
                      {position.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="text-sm text-muted-foreground flex items-center">
                          <Circle className="h-1.5 w-1.5 text-primary fill-current mr-2" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-6">What You&apos;ll Get</h3>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <Circle className="h-2 w-2 text-google-green fill-current" />
                  <span className="text-muted-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-card to-accent rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
            <p className="text-muted-foreground mb-6">
              Applications are open year-round! Submit your application and join a community of innovators, creators,
              and problem-solvers.
            </p>
            <div className="space-y-4">
              <Button className="w-full bg-primary hover:bg-primary/90 text-lg py-3">Apply Now</Button>
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default RecruitmentSection
