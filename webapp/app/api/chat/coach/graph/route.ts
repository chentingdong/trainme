// This end point shows the langgraph graph of the agent as a png image
import { agent } from "../agent";

export async function GET() {
  const representation = agent.getGraph();
  console.log('Representation:', representation); // Log the representation
  if (!representation) {
    console.error('Failed to get graph representation.');
    return new Response('Graph representation not found', { status: 404 });
  }

  const image = await representation.drawMermaidPng();
  console.log('Image:', image); // Log the image object
  if (!image) {
    console.error('Failed to draw image.');
    return new Response('Image generation failed', { status: 500 });
  }

  const arrayBuffer = await image.arrayBuffer();
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
