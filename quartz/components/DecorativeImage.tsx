import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { joinSegments } from "../util/path"

interface Options {
  imagePath?: string
  alt?: string
  maxWidth?: string
  opacity?: number
}

const defaultOptions: Options = {
  imagePath: "static/decorative-pattern.png",
  alt: "Decorative pattern",
  maxWidth: "100%",
  opacity: 1,
}

export default ((userOpts?: Options) => {
  const opts = { ...defaultOptions, ...userOpts }
  
  function DecorativeImage({ fileData }: QuartzComponentProps) {
    const baseDir = pathToRoot(fileData.slug!)
    const imageUrl = joinSegments(baseDir, opts.imagePath!)
    
    return (
      <div class="decorative-image-container">
        <img 
          src={imageUrl} 
          alt={opts.alt}
          class="decorative-image"
          style={{
            maxWidth: opts.maxWidth,
            opacity: opts.opacity,
          }}
        />
      </div>
    )
  }

  DecorativeImage.css = `
  .decorative-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 2rem 0;
  }

  .decorative-image {
    display: block;
    width: auto;
    height: auto;
    object-fit: contain;
  }
  `

  return DecorativeImage
}) satisfies QuartzComponentConstructor

