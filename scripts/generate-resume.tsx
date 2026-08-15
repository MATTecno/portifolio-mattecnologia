/* eslint-disable react-refresh/only-export-components */
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import React from 'react'
import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToFile,
} from '@react-pdf/renderer'
import {
  FEATURED_RECRUITER_PROJECTS,
  RECRUITER_PROFILE,
  RESUME_PHONE,
  SECONDARY_RECRUITER_PROJECTS,
} from '../src/data/recruiter'

const outputPath = resolve(process.cwd(), 'public/Marcelo-Diogo-Teixeira-Curriculo.pdf')
const A4_SIZE = { width: 595.28, height: 841.89 } as const

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingRight: 36,
    paddingBottom: 28,
    paddingLeft: 36,
    fontFamily: 'Helvetica',
    fontSize: 8.6,
    lineHeight: 1.35,
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  header: {
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1d4ed8',
  },
  name: {
    fontSize: 19,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  headline: {
    marginTop: 7,
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#1d4ed8',
  },
  contactRow: {
    marginTop: 7,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    color: '#475569',
  },
  contactLink: {
    color: '#1d4ed8',
    textDecoration: 'none',
  },
  section: {
    marginTop: 11,
  },
  sectionTitle: {
    marginBottom: 5,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  paragraph: {
    marginBottom: 4,
    color: '#334155',
  },
  entry: {
    marginBottom: 8,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  entryTitle: {
    fontSize: 9.2,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  period: {
    fontFamily: 'Helvetica-Bold',
    color: '#475569',
  },
  company: {
    marginTop: 1,
    marginBottom: 3,
    fontFamily: 'Helvetica-Bold',
    color: '#1d4ed8',
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2.2,
    paddingRight: 5,
  },
  bulletMarker: {
    width: 11,
    color: '#1d4ed8',
  },
  bulletText: {
    flex: 1,
    color: '#334155',
  },
  project: {
    marginBottom: 7,
  },
  projectMeta: {
    marginTop: 1,
    fontSize: 7.8,
    color: '#64748b',
  },
  projectSummary: {
    marginTop: 2,
    color: '#334155',
  },
  inlineLabel: {
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  compactEntry: {
    marginBottom: 4,
  },
  skillGroup: {
    marginBottom: 3,
  },
  footer: {
    position: 'absolute',
    right: 36,
    bottom: 16,
    left: 36,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#cbd5e1',
    paddingTop: 4,
    fontSize: 7,
    color: '#64748b',
  },
})

function Bullet({ children }: { children: string }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletMarker}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  )
}

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.name}>{RECRUITER_PROFILE.name}</Text>
      <Text style={styles.headline}>{RECRUITER_PROFILE.headline}</Text>
      <View style={styles.contactRow}>
        <Text>{RECRUITER_PROFILE.location}</Text>
        <Text>•</Text>
        <Text>{RESUME_PHONE}</Text>
        <Text>•</Text>
        <Link src={`mailto:${RECRUITER_PROFILE.email}`} style={styles.contactLink}>{RECRUITER_PROFILE.email}</Link>
        <Text>•</Text>
        <Link src={RECRUITER_PROFILE.linkedin} style={styles.contactLink}>linkedin.com/in/marcelo-diogo-05289b264</Link>
        <Text>•</Text>
        <Link src={RECRUITER_PROFILE.github} style={styles.contactLink}>github.com/MATTecno</Link>
      </View>
      <Text style={{ marginTop: 5, color: '#475569' }}>
        Disponibilidade: remoto, híbrido e presencial em Belo Horizonte.
      </Text>
    </View>
  )
}

function Footer({ page }: { page: number }) {
  return (
    <View style={styles.footer} fixed>
      <Text>Marcelo Diogo Teixeira — Desenvolvedor Full Stack</Text>
      <Text>Página {page} de 2</Text>
    </View>
  )
}

function ResumeDocument() {
  return (
    <Document
      title="Marcelo Diogo Teixeira — Currículo"
      author="Marcelo Diogo Teixeira"
      subject="Currículo profissional para oportunidades de Desenvolvimento Full Stack"
      keywords="Full Stack, PHP, TypeScript, Vue.js, Oracle, PostgreSQL, APIs REST"
      language="pt-BR"
    >
      <Page size={A4_SIZE} style={styles.page}>
        <Header />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo profissional</Text>
          {RECRUITER_PROFILE.summary.map((paragraph) => (
            <Text key={paragraph} style={styles.paragraph}>{paragraph}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiência profissional</Text>
          {RECRUITER_PROFILE.experience.map((experience) => (
            <View key={experience.id} style={styles.entry}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{experience.role}</Text>
                <Text style={styles.period}>{experience.period}</Text>
              </View>
              <Text style={styles.company}>{experience.company}</Text>
              {experience.highlights.map((highlight) => <Bullet key={highlight}>{highlight}</Bullet>)}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Competências principais</Text>
          {RECRUITER_PROFILE.skills.map((group) => (
            <Text key={group.title} style={styles.skillGroup}>
              <Text style={styles.inlineLabel}>{group.title}: </Text>
              {group.items.join(', ')}.
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Formação acadêmica</Text>
          <Text style={styles.inlineLabel}>{RECRUITER_PROFILE.education.course}</Text>
          <Text>{RECRUITER_PROFILE.education.institution} • {RECRUITER_PROFILE.education.period}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certificações e cursos</Text>
          {RECRUITER_PROFILE.certifications.map((certification) => (
            <Text key={certification} style={styles.compactEntry}>• {certification}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Idiomas</Text>
          {RECRUITER_PROFILE.languages.map((language) => (
            <Text key={language.language} style={styles.compactEntry}>
              <Text style={styles.inlineLabel}>{language.language}: </Text>{language.level}.
            </Text>
          ))}
        </View>
        <Footer page={1} />
      </Page>

      <Page size={A4_SIZE} style={styles.page}>
        <Header />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projetos relevantes</Text>
          {FEATURED_RECRUITER_PROJECTS.map((project) => (
            <View key={project.id} style={styles.project}>
              <Text style={styles.entryTitle}>{project.title}</Text>
              <Text style={styles.projectMeta}>{project.category} • {project.stack.join(', ')}</Text>
              <Text style={styles.projectSummary}>{project.summary}</Text>
              {project.contributions.slice(0, 2).map((contribution) => <Bullet key={contribution}>{contribution}</Bullet>)}
              {project.links.map((link) => (
                <Link key={link.href} src={link.href} style={styles.contactLink}>{link.label}: {link.href}</Link>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outros projetos</Text>
          {SECONDARY_RECRUITER_PROJECTS.map((project) => (
            <View key={project.id} style={styles.compactEntry}>
              <Text style={styles.inlineLabel}>{project.title}</Text>
              <Text>{project.summary}</Text>
            </View>
          ))}
        </View>
        <Footer page={2} />
      </Page>
    </Document>
  )
}

await mkdir(dirname(outputPath), { recursive: true })
await renderToFile(<ResumeDocument />, outputPath)
console.log(`Currículo gerado em ${outputPath}`)
