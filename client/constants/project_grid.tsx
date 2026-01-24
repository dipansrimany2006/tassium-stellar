export const ProjectsData: ProjectData[] = [
  {
    img_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200", // server room
    title: "Deploy Web Apps",
    subtitle: "Next.js / React / Node"
  },
  {
    img_url: "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800", // blockchain/crypto
    title: "Earn Compute Credits",
    subtitle: "Share Idle Resources",
    aspectRatio: "3/4"
  },
  {
    img_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800", // globe/network
    title: "Global Edge Network",
    subtitle: "Distributed Workers",
    aspectRatio: "1/1"
  },
  {
    img_url: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=1200", // github/code
    title: "Git Push to Deploy",
    subtitle: "Zero Config CI/CD"
  }
]

export interface ProjectData {
  img_url: string,
  title: string,
  subtitle: string,
  aspectRatio?: string
}