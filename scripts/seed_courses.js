const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ghyqmfcjphflitfuupce.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoeXFtZmNqcGhmbGl0ZnV1cGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NTgzNjUsImV4cCI6MjA4MjUzNDM2NX0.z6Om5m5QE8nhHgXw_5IGQ14oYHBgVHKpECoalT6BcDY';

const supabase = createClient(supabaseUrl, supabaseKey);

const newCourses = [
    {
        title: 'Dominando o Trabalho Remoto',
        instructor: 'Rafael Barbosa',
        price: 49.90,
        rating: 4.8,
        reviews_count: 320,
        image_url: 'https://images.unsplash.com/photo-1593642632823-8f78536788c6?auto=format&fit=crop&w=800&q=80'
    },
    {
        title: 'React Native para Iniciantes',
        instructor: 'Diego Fernandes',
        price: 89.90,
        rating: 4.9,
        reviews_count: 150,
        image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80'
    },
    {
        title: 'Marketing Digital para Nômades',
        instructor: 'Ana Silva',
        price: 59.90,
        rating: 4.7,
        reviews_count: 85,
        image_url: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80'
    },
    {
        title: 'Edição de Vídeo com Premiere Pro',
        instructor: 'Gaveta',
        price: 79.90,
        rating: 4.9,
        reviews_count: 500,
        image_url: 'https://images.unsplash.com/photo-1574717436401-063d29b30190?auto=format&fit=crop&w=800&q=80'
    },
    {
        title: 'Investimentos para Viajantes',
        instructor: 'Primo Rico',
        price: 39.90,
        rating: 4.6,
        reviews_count: 1200,
        image_url: 'https://images.unsplash.com/photo-1579532507281-2270b6667583?auto=format&fit=crop&w=800&q=80'
    },
    {
        title: 'Design de Interfaces com Figma',
        instructor: 'Zeno Rocha',
        price: 69.90,
        rating: 5.0,
        reviews_count: 210,
        image_url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80'
    },
    {
        title: 'Inglês Avançado para Negócios',
        instructor: 'Mairo Vergara',
        price: 45.00,
        rating: 4.5,
        reviews_count: 3000,
        image_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80'
    },
    {
        title: 'Produção de Conteúdo para Youtube',
        instructor: 'Peter Jordan',
        price: 55.50,
        rating: 4.8,
        reviews_count: 450,
        image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80'
    }
];

async function seed() {
    console.log("Seeding courses...");

    // 1. Try to login first (since RLS likely requires auth for inserts)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'test_generated_123@nomad.com',
        password: 'password123'
    });

    if (authError) {
        console.error("Auth Failed:", authError.message);
        console.log("Attempting insert without auth (might fail if RLS is on)...");
    } else {
        console.log("Logged in as:", authData.user.email);
    }

    // 2. Insert rows
    const { data, error } = await supabase
        .from('courses')
        .insert(newCourses)
        .select();

    if (error) {
        console.error('Insert Error:', error.message);
    } else {
        console.log('Success! Inserted', data.length, 'courses.');
    }
}

seed();
