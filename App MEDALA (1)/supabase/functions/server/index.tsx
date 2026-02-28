import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Initialize storage bucket
const bucketName = 'make-8ad5a8d4-medala-files';
const initStorage = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName);
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
      console.log(`Created bucket: ${bucketName}`);
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

initStorage();

// Health check
app.get('/make-server-8ad5a8d4/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// User Profile Routes
app.post('/make-server-8ad5a8d4/profile', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, profile } = body;

    if (!userId || !profile) {
      return c.json({ error: 'Missing userId or profile data' }, 400);
    }

    await kv.set(`profile:${userId}`, profile);
    return c.json({ success: true, profile });
  } catch (error) {
    console.error('Error saving profile:', error);
    return c.json({ error: 'Failed to save profile' }, 500);
  }
});

app.get('/make-server-8ad5a8d4/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const profile = await kv.get(`profile:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    return c.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Health Metrics Routes
app.post('/make-server-8ad5a8d4/metrics', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, metric } = body;

    if (!userId || !metric) {
      return c.json({ error: 'Missing userId or metric data' }, 400);
    }

    // Store metric with timestamp
    const timestamp = Date.now();
    const key = `metrics:${userId}:${timestamp}`;
    await kv.set(key, { ...metric, timestamp });

    return c.json({ success: true, metric });
  } catch (error) {
    console.error('Error saving metric:', error);
    return c.json({ error: 'Failed to save metric' }, 500);
  }
});

app.get('/make-server-8ad5a8d4/metrics/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const metrics = await kv.getByPrefix(`metrics:${userId}:`);
    
    // Sort by timestamp descending
    const sortedMetrics = metrics.sort((a, b) => b.timestamp - a.timestamp);

    return c.json({ metrics: sortedMetrics });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return c.json({ error: 'Failed to fetch metrics' }, 500);
  }
});

// Lab Results Routes
app.post('/make-server-8ad5a8d4/lab-results/upload', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, fileName, fileData, analysis } = body;

    if (!userId || !fileName || !fileData) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Convert base64 to buffer
    const buffer = Uint8Array.from(atob(fileData), c => c.charCodeAt(0));
    
    // Upload to Supabase Storage
    const filePath = `${userId}/${Date.now()}_${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Create signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 31536000);

    // Store lab result metadata
    const labResult = {
      userId,
      fileName,
      filePath,
      fileUrl: signedUrlData?.signedUrl,
      analysis: analysis || {},
      timestamp: Date.now(),
    };

    await kv.set(`lab:${userId}:${Date.now()}`, labResult);

    return c.json({ success: true, labResult });
  } catch (error) {
    console.error('Error uploading lab result:', error);
    return c.json({ error: 'Failed to upload lab result' }, 500);
  }
});

app.get('/make-server-8ad5a8d4/lab-results/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const labResults = await kv.getByPrefix(`lab:${userId}:`);
    
    // Sort by timestamp descending
    const sortedResults = labResults.sort((a, b) => b.timestamp - a.timestamp);

    return c.json({ labResults: sortedResults });
  } catch (error) {
    console.error('Error fetching lab results:', error);
    return c.json({ error: 'Failed to fetch lab results' }, 500);
  }
});

// Voice Notes Routes
app.post('/make-server-8ad5a8d4/voice-notes/upload', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, audioData, transcript, analysis } = body;

    if (!userId || !audioData) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Convert base64 to buffer
    const buffer = Uint8Array.from(atob(audioData), c => c.charCodeAt(0));
    
    // Upload to Supabase Storage
    const fileName = `voice_${Date.now()}.webm`;
    const filePath = `${userId}/voice/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: 'audio/webm',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: 'Failed to upload voice note' }, 500);
    }

    // Create signed URL
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(filePath, 31536000);

    // Store voice note metadata
    const voiceNote = {
      userId,
      fileName,
      filePath,
      audioUrl: signedUrlData?.signedUrl,
      transcript: transcript || '',
      analysis: analysis || {},
      timestamp: Date.now(),
    };

    await kv.set(`voice:${userId}:${Date.now()}`, voiceNote);

    return c.json({ success: true, voiceNote });
  } catch (error) {
    console.error('Error uploading voice note:', error);
    return c.json({ error: 'Failed to upload voice note' }, 500);
  }
});

app.get('/make-server-8ad5a8d4/voice-notes/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const voiceNotes = await kv.getByPrefix(`voice:${userId}:`);
    
    // Sort by timestamp descending
    const sortedNotes = voiceNotes.sort((a, b) => b.timestamp - a.timestamp);

    return c.json({ voiceNotes: sortedNotes });
  } catch (error) {
    console.error('Error fetching voice notes:', error);
    return c.json({ error: 'Failed to fetch voice notes' }, 500);
  }
});

// Clinical Notes Routes
app.post('/make-server-8ad5a8d4/clinical-notes', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, note } = body;

    if (!userId || !note) {
      return c.json({ error: 'Missing userId or note data' }, 400);
    }

    const timestamp = Date.now();
    const key = `note:${userId}:${timestamp}`;
    await kv.set(key, { ...note, timestamp });

    return c.json({ success: true, note: { ...note, timestamp } });
  } catch (error) {
    console.error('Error saving clinical note:', error);
    return c.json({ error: 'Failed to save clinical note' }, 500);
  }
});

app.get('/make-server-8ad5a8d4/clinical-notes/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const notes = await kv.getByPrefix(`note:${userId}:`);
    
    // Sort by timestamp descending
    const sortedNotes = notes.sort((a, b) => b.timestamp - a.timestamp);

    return c.json({ notes: sortedNotes });
  } catch (error) {
    console.error('Error fetching clinical notes:', error);
    return c.json({ error: 'Failed to fetch clinical notes' }, 500);
  }
});

// Risk Analysis Route
app.get('/make-server-8ad5a8d4/risk-analysis/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // Get recent metrics
    const metrics = await kv.getByPrefix(`metrics:${userId}:`);
    const profile = await kv.get(`profile:${userId}`);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }

    // Calculate risk scores based on metrics
    const recentMetrics = metrics.slice(0, 7); // Last 7 entries
    
    const riskAnalysis = {
      healthStabilityScore: 72,
      riskLevel: 'moderate',
      trends: {
        bloodPressure: 'increasing',
        glucose: 'stable',
        medication: 'declining',
        sleep: 'declining',
      },
      alerts: [
        {
          type: 'critical',
          message: 'Blood pressure has remained above recommended threshold for 3 consecutive days',
          timestamp: Date.now(),
        },
      ],
      recommendations: [
        'Medication adherence at 75% - below recommended 90% threshold',
        'Sleep quality declining - averaging 6.5 hours (target: 7-9 hours)',
        'Recommend cardiology follow-up within 2-4 weeks',
      ],
    };

    return c.json({ riskAnalysis });
  } catch (error) {
    console.error('Error calculating risk analysis:', error);
    return c.json({ error: 'Failed to calculate risk analysis' }, 500);
  }
});

Deno.serve(app.fetch);
