import axios from 'axios';
import * as tf from '@tensorflow/tfjs';

interface WhoisData {
  creationDate: string;
  registrar: string;
  // Add more WHOIS fields as needed
}

interface BusinessRegistry {
  status: string;
  type: string;
  // Add more business registry fields as needed
}

export async function analyzeUrl(url: string) {
  try {
    // Fetch WHOIS data
    const whoisData = await fetchWhoisData(url);
    
    // Get CT Score
    const ctScore = await fetchCTScore(url);
    
    // Get Business Registry data
    const businessRegistry = await fetchBusinessRegistry(url);
    
    // Get ML model prediction
    const modelScore = await predictUrl(url);
    
    // Calculate trust score (average of all scores)
    const trustScore = calculateTrustScore(whoisData, ctScore, modelScore);
    
    return {
      whoisData,
      ctScore,
      businessRegistry,
      modelScore,
      trustScore
    };
  } catch (error) {
    console.error('Error analyzing URL:', error);
    throw error;
  }
}

export async function fetchWhoisData(url: string): Promise<WhoisData> {
  try {
    const response = await fetch(`https://api.whoislookupapi.com/v1/whois?domain=${url}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY' // Replace with a valid API key
      }
    });

    if (!response.ok) {
      throw new Error(`WHOIS lookup failed: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      creationDate: data.creation_date || 'Unknown',
      registrar: data.registrar || 'Unknown'
    };
  } catch (error) {
    console.error(error);
    return { creationDate: 'Unknown', registrar: 'Unknown' };
  }
}

async function fetchCTScore(url: string): Promise<number> {
  try {
    const response = await fetch(`https://crt.sh/?q=${url}&output=json`);
    
    if (!response.ok) {
      throw new Error(`CT Log lookup failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // A simple heuristic: More certificates = higher score
    const score = Math.min(100, data.length * 5); // Capping at 100

    return score;
  } catch (error) {
    console.error(error);
    return 0; // Default to 0 if there's an error
  }
}


async function fetchBusinessRegistry(url: string): Promise<BusinessRegistry> {
  try {
    const response = await fetch(`https://api.opencorporates.com/v0.4/companies/search?q=${url}`);

    if (!response.ok) {
      throw new Error(`Business registry lookup failed: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.results.companies.length === 0) {
      throw new Error("No business registry data found.");
    }

    const company = data.results.companies[0].company;

    return {
      status: company.current_status || 'Unknown',
      type: company.company_type || 'Unknown'
    };
  } catch (error) {
    console.error(error);
    return { status: 'Unknown', type: 'Unknown' };
  }
}

async function predictUrl(url: string): Promise<number> {
  try {
    // In a real implementation, you would:
    // 1. Load the model
    // const model = await tf.loadLayersModel('random_forest_model.joblib');
    // 2. Preprocess the URL
    // 3. Make prediction
    
    // This is a mock implementation
    return 90;
  } catch (error) {
    console.error('Error predicting URL:', error);
    return 0;
  }
}

function calculateTrustScore(
  whoisData: WhoisData,
  ctScore: number,
  modelScore: number
): number {
  // Simple average of scores
  // In a real implementation, you might want to weight these differently
  return (ctScore + modelScore) / 2;
}