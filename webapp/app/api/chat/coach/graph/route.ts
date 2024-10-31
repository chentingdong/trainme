// This end point shows the combined langgraph graph of the agent and workout planner as a png image
import { workoutPlannerGraph } from "../workoutPlanner";
import { agent } from "../agent";
import { createCanvas, loadImage } from 'canvas';

export async function GET() {
  const workoutPlannerGraphRepresentation = workoutPlannerGraph.getGraph();
  const agentGraphRepresentation = agent.getGraph();

  if (!workoutPlannerGraphRepresentation || !agentGraphRepresentation) {
    console.error('Failed to get graph representation.');
    return new Response('Graph representation not found', { status: 404 });
  }

  const agentImage = await agentGraphRepresentation.drawMermaidPng(); 
  const workoutPlannerImage = await workoutPlannerGraphRepresentation.drawMermaidPng(); 

  // Convert the workout planner and agent images to Buffer
  const agentImageBuffer = Buffer.from(await agentImage.arrayBuffer());
  const workoutPlannerImageBuffer = Buffer.from(await workoutPlannerImage.arrayBuffer());

  // Combine the two images into one
  const combinedImage = await combineImages(agentImageBuffer, workoutPlannerImageBuffer);

  if (!combinedImage) {
    console.error('Failed to combine images.');
    return new Response('Image generation failed', { status: 500 });
  }

  const arrayBuffer = combinedImage;
  if (!arrayBuffer) {
    console.error('Failed to generate image buffer.');
    return new Response('Error generating image', { status: 500 });
  }

  // Set the appropriate headers for PNG image
  const headers = new Headers({
    'Content-Type': 'image/png',
    'Content-Length': arrayBuffer.byteLength.toString(),
  });

  return new Response(Buffer.from(arrayBuffer), { headers });
}

async function combineImages(image1: Buffer, image2: Buffer): Promise<Buffer> {
  const img1 = await loadImage(image1);
  const img2 = await loadImage(image2);

  const gap = 10; 
  const borderWidth = 1; 
  const borderColor = '#666666'; 
  const padding = 20; 

  const combinedWidth = img1.width + img2.width + gap + 2 * padding; // Add gap and padding to width
  const combinedHeight = Math.max(img1.height, img2.height) + 2 * borderWidth + padding + 40; // Add bottom padding for titles

  const canvas = createCanvas(combinedWidth, combinedHeight);
  const ctx = canvas.getContext('2d');

  // Draw border for the first image
  ctx.fillStyle = borderColor;
  ctx.fillRect(padding, padding, img1.width + 2 * borderWidth, img1.height + 2 * borderWidth);
  ctx.drawImage(img1, padding + borderWidth, padding + borderWidth);

  // Draw border for the second image
  ctx.fillRect(img1.width + gap + padding, padding, img2.width + 2 * borderWidth, img2.height + 2 * borderWidth);
  ctx.drawImage(img2, img1.width + gap + padding + borderWidth, padding + borderWidth);

  // Add names below each image
  ctx.font = '16px Arial'; 
  ctx.fillStyle = 'black';
  ctx.fillText('Agent Image', padding + (img1.width / 2), img1.height + padding + borderWidth + 30); // Name for the first image
  ctx.fillText('Workout Planner', img1.width + gap + padding + (img2.width / 2) - 30, img2.height + padding + borderWidth + 30); // Name for the second image

  return canvas.toBuffer('image/png');
}