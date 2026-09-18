import { generateImageFromService, imageEndpointInfo } from '../services/imageService.js'

/**
 * Tool chamada pelo Image Agent.
 * Ela não gera pixels: apenas aciona o Image Service, que chama a Atlas Cloud.
 */
export async function generateImage(
  prompt: string,
  onStatus?: (status: string) => void,
): Promise<string> {
  return generateImageFromService(prompt, onStatus)
}

export { imageEndpointInfo }
