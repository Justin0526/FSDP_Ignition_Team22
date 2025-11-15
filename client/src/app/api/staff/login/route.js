import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';



// Initializing Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);



// Authenticating staff login credentials
export async function POST(request) {
    try {
        // Parse request body
        const { email, password } = await request.json();

        console.log('[API] Login attempt for email:', email);

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: 'Email and Password are required' },
                { status: 400 }
            );
        }

        // Query the staff table - ONLY check email and is_active
        const { data: staff, error } = await supabase
            .from('staff')
            .select('*')
            .eq('email', email)
            .eq('is_active', true)  // Only allows active staff
            .single();

        // DEBUG: Print what was gotten from database
        // console.log('[API] ✅ TEST MODE - Checking email only');
        // console.log('[API] 🔍 TEST - Staff found:', staff);
        // console.log('[API] 🔍 TEST - Error:', error);
        
        // if (staff) {
        //     console.log('[API] 🔍 TEST - Available columns:', Object.keys(staff));
        //     console.log('[API] 🔍 TEST - Full staff data:', JSON.stringify(staff, null, 2));
        // }

        // Check if staff found
        if (error || !staff) {
            console.log('[API] Login failed - user not found:', error?.message || 'Invalid email');
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // NOW compare the password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, staff.password_hash);

        if (!isPasswordValid) {
            console.log('[API] Login failed - incorrect password');
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        console.log('[API] ✅ Login successful for:', staff.full_name);

        // Return success with staff data
        return NextResponse.json({
            success: true,
            message: 'Login successful',
            staff: {
                staff_id: staff.staff_id,
                full_name: staff.full_name,
                role: staff.role,
                email: staff.email,
            },
        });
    } catch (error) {
        // Handle any server errors
        console.error('[API] Server error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}
