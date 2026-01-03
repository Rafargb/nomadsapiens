const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ghyqmfcjphflitfuupce.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoeXFtZmNqcGhmbGl0ZnV1cGNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NTgzNjUsImV4cCI6MjA4MjUzNDM2NX0.z6Om5m5QE8nhHgXw_5IGQ14oYHBgVHKpECoalT6BcDY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking connection...");
    const { data, error } = await supabase.from('courses').select('count', { count: 'exact', head: true });

    if (error) {
        console.log('ERROR_CODE:', error.code);
        console.log('ERROR_MSG:', error.message);
    } else {
        console.log('SUCCESS_COUNT:', data ? data.length : 0); // Note: head:true returns null data usually but check count, or just select * limit 1

        // Double check with a normal select
        const { data: rows, error: err2 } = await supabase.from('courses').select('*').limit(1);
        console.log('ROWS_FOUND:', rows ? rows.length : 0);
    }
}

check();
