import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/entities/user.entity';
import { WorkerProfile } from './users/entities/worker-profile.entity';
import { EmployerProfile } from './users/entities/employer-profile.entity';
import { Job } from './jobs/entities/job.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, WorkerProfile, EmployerProfile, Job],
  synchronize: false,
});

async function seed() {
  await AppDataSource.initialize();
  console.log('Connected to DB');

  const userRepo = AppDataSource.getRepository(User);
  const jobRepo = AppDataSource.getRepository(Job);

  const existing = await userRepo.count();
  if (existing > 0) {
    console.log(`DB already has ${existing} users — skipping seed.`);
    await AppDataSource.destroy();
    return;
  }

  const hash = (pw: string) => bcrypt.hash(pw, 10);

  // ── Workers ────────────────────────────────────────────────────────────────
  const workers = await userRepo.save([
    userRepo.create({
      role: 'worker',
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@gmail.com',
      passwordHash: await hash('demo1234'),
      phone: '+57 310 452 8891',
      location: 'Suba, Bogotá',
      bio: 'Plomero con más de 8 años de experiencia en Bogotá.',
      workerProfile: {
        category: 'plomeria',
        skills: ['Reparación de tuberías', 'Grifería', 'Destapes', 'Calentadores'],
        hourlyRate: 35000,
        rating: 4.8,
        reviewCount: 47,
        completedJobs: 52,
        verified: true,
        available: true,
        portfolio: [],
      } as any,
    }),
    userRepo.create({
      role: 'worker',
      name: 'Andrés Vargas',
      email: 'af.vargas@hotmail.com',
      passwordHash: await hash('demo1234'),
      phone: '+57 314 887 2230',
      location: 'Chapinero, Bogotá',
      bio: 'Electricista certificado RETIE con experiencia en redes residenciales y comerciales.',
      workerProfile: {
        category: 'electricidad',
        skills: ['Instalaciones eléctricas', 'Tableros', 'Tomacorrientes', 'Iluminación LED'],
        hourlyRate: 40000,
        rating: 4.6,
        reviewCount: 31,
        completedJobs: 38,
        verified: true,
        available: true,
        portfolio: [],
      } as any,
    }),
    userRepo.create({
      role: 'worker',
      name: 'Diego Rojas',
      email: 'diego.rojas.bogota@gmail.com',
      passwordHash: await hash('demo1234'),
      phone: '+57 318 220 4471',
      location: 'Kennedy, Bogotá',
      bio: 'Carpintero artesanal con taller propio. Muebles a medida y reparaciones.',
      workerProfile: {
        category: 'carpinteria',
        skills: ['Muebles a medida', 'Puertas', 'Pisos laminados', 'Reparaciones'],
        hourlyRate: 38000,
        rating: 4.9,
        reviewCount: 62,
        completedJobs: 71,
        verified: true,
        available: false,
        portfolio: [],
      } as any,
    }),
    userRepo.create({
      role: 'worker',
      name: 'Luisa Fernanda Torres',
      email: 'luisa.torres.clean@gmail.com',
      passwordHash: await hash('demo1234'),
      phone: '+57 312 993 5610',
      location: 'Usaquén, Bogotá',
      bio: 'Servicio de limpieza profunda para apartamentos y casas.',
      workerProfile: {
        category: 'limpieza',
        skills: ['Limpieza profunda', 'Desinfección', 'Limpieza de tapetes', 'Oficinas'],
        hourlyRate: 25000,
        rating: 4.7,
        reviewCount: 89,
        completedJobs: 104,
        verified: true,
        available: true,
        portfolio: [],
      } as any,
    }),
    userRepo.create({
      role: 'worker',
      name: 'Miguel Herrera',
      email: 'miguel.herrera.pintor@yahoo.com',
      passwordHash: await hash('demo1234'),
      phone: '+57 300 774 1293',
      location: 'Engativá, Bogotá',
      bio: 'Pintor de interiores y exteriores con 12 años de experiencia.',
      workerProfile: {
        category: 'pintura',
        skills: ['Pintura interior', 'Pintura exterior', 'Estuco', 'Masilla'],
        hourlyRate: 30000,
        rating: 4.5,
        reviewCount: 28,
        completedJobs: 35,
        verified: false,
        available: true,
        portfolio: [],
      } as any,
    }),
  ]);

  console.log(`Created ${workers.length} workers`);

  // ── Employers ──────────────────────────────────────────────────────────────
  const employers = await userRepo.save([
    userRepo.create({
      role: 'employer',
      name: 'Juan Pablo Restrepo',
      email: 'jp.restrepo@gmail.com',
      passwordHash: await hash('demo1234'),
      phone: '+57 316 450 9012',
      location: 'Chapinero, Bogotá',
      bio: 'Propietario de apartamento en Chapinero.',
      employerProfile: {} as any,
    }),
    userRepo.create({
      role: 'employer',
      name: 'María Camila Ospina',
      email: 'mcospina@empresa.co',
      passwordHash: await hash('demo1234'),
      phone: '+57 311 234 5678',
      location: 'Usaquén, Bogotá',
      bio: 'Administradora de propiedad horizontal.',
      employerProfile: { companyName: 'Torres del Norte P.H.' } as any,
    }),
    userRepo.create({
      role: 'employer',
      name: 'Roberto Gómez',
      email: 'roberto.gomez.bta@gmail.com',
      passwordHash: await hash('demo1234'),
      phone: '+57 313 876 5432',
      location: 'Suba, Bogotá',
      bio: 'Constructor independiente.',
      employerProfile: {} as any,
    }),
  ]);

  console.log(`Created ${employers.length} employers`);

  // ── Jobs ───────────────────────────────────────────────────────────────────
  const jobs = await jobRepo.save([
    jobRepo.create({
      employerId: employers[0].id,
      title: 'Reparación de tubería que gotea en la cocina',
      description: 'Hay una fuga debajo del lavaplatos. Necesito que revisen si es el sifón o la tubería.',
      category: 'plomeria',
      location: 'Chapinero, Bogotá',
      budget: { min: 80000, max: 150000 },
      urgency: 'urgent',
      status: 'open',
    }),
    jobRepo.create({
      employerId: employers[0].id,
      title: 'Instalación de toma eléctrica en habitación',
      description: 'Necesito instalar 2 tomacorrientes dobles en la habitación principal.',
      category: 'electricidad',
      location: 'Chapinero, Bogotá',
      budget: { min: 60000, max: 120000 },
      urgency: 'this_week',
      status: 'open',
    }),
    jobRepo.create({
      employerId: employers[1].id,
      title: 'Pintura completa de apartamento 3 habitaciones',
      description: 'Apartamento de 70m2 en el piso 8. Paredes y techo, colores a definir.',
      category: 'pintura',
      location: 'Usaquén, Bogotá',
      budget: { min: 800000, max: 1500000 },
      urgency: 'flexible',
      status: 'open',
    }),
    jobRepo.create({
      employerId: employers[1].id,
      title: 'Limpieza profunda post-obra apartamento',
      description: 'Se terminaron remodelaciones. Necesito limpieza a fondo antes de mudanza.',
      category: 'limpieza',
      location: 'Usaquén, Bogotá',
      budget: { min: 150000, max: 250000 },
      urgency: 'this_week',
      status: 'open',
    }),
    jobRepo.create({
      employerId: employers[2].id,
      title: 'Fabricación de closet a medida dormitorio principal',
      description: 'Espacio de 2.4m x 0.6m x 2.4m. Puertas corredizas espejo. Material MDP.',
      category: 'carpinteria',
      location: 'Suba, Bogotá',
      budget: { min: 1200000, max: 2000000 },
      urgency: 'flexible',
      status: 'open',
    }),
  ]);

  console.log(`Created ${jobs.length} jobs`);
  console.log('\nSeed complete. Demo credentials: password = demo1234 for all users.');
  console.log('Workers:', workers.map((w) => w.email).join(', '));
  console.log('Employers:', employers.map((e) => e.email).join(', '));

  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
