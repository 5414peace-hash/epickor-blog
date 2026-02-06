/**
 * Amazon URL Parser API
 * 
 * This API route parses Amazon product URLs and extracts product information
 * including title, price, and description.
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    // Validate Amazon URL
    if (!url.includes('amazon.com') && !url.includes('amzn.to')) {
      return NextResponse.json(
        { error: 'Invalid Amazon URL' },
        { status: 400 }
      );
    }
    
    // Fetch the Amazon page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch Amazon page' },
        { status: 500 }
      );
    }
    
    const html = await response.text();
    
    // Parse HTML to extract product information
    const productInfo = parseAmazonHTML(html);
    
    if (!productInfo.name) {
      return NextResponse.json(
        { error: 'Failed to parse product information' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(productInfo);
    
  } catch (error) {
    console.error('Amazon parse error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function parseAmazonHTML(html: string) {
  // Extract product title
  const titleMatch = html.match(/<span id="productTitle"[^>]*>(.*?)<\/span>/s);
  const name = titleMatch ? titleMatch[1].trim().replace(/<[^>]*>/g, '').trim() : '';
  
  // Extract price
  const priceMatch = html.match(/<span class="a-price-whole"[^>]*>(.*?)<\/span>/);
  const priceFraction = html.match(/<span class="a-price-fraction"[^>]*>(.*?)<\/span>/);
  let price = '';
  if (priceMatch) {
    price = `$${priceMatch[1].trim()}${priceFraction ? priceFraction[1].trim() : ''}`;
  }
  
  // Alternative price patterns
  if (!price) {
    const altPriceMatch = html.match(/\$(\d+\.?\d*)/);
    if (altPriceMatch) {
      price = `$${altPriceMatch[1]}`;
    }
  }
  
  // Extract description (feature bullets)
  const descMatch = html.match(/<div id="feature-bullets"[^>]*>(.*?)<\/div>/s);
  let description = '';
  if (descMatch) {
    const bullets = descMatch[1].match(/<span class="a-list-item"[^>]*>(.*?)<\/span>/gs);
    if (bullets) {
      description = bullets
        .map(b => b.replace(/<[^>]*>/g, '').trim())
        .filter(b => b.length > 0)
        .slice(0, 3)
        .join('. ');
    }
  }
  
  // Alternative description from meta tag
  if (!description) {
    const metaDescMatch = html.match(/<meta name="description" content="(.*?)"/);
    if (metaDescMatch) {
      description = metaDescMatch[1].trim();
    }
  }
  
  // Extract image URL
  const imageMatch = html.match(/<img[^>]*id="landingImage"[^>]*src="(.*?)"/);
  const image = imageMatch ? imageMatch[1] : '';
  
  return {
    name: name.substring(0, 200), // Limit length
    price: price || 'Price not available',
    description: description.substring(0, 500) || 'Product description not available',
    image: image,
  };
}
