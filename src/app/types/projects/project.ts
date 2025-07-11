interface Contributor {
  name: string;
  initial: string;
  color: string;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  languages: string[];
  link: string;
  color: string;
  contributors?: Contributor[];
  imageUrl?: string;
}

