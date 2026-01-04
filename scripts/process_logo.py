from PIL import Image
import sys

def remove_dark_background(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()
        
        new_data = []
        for item in datas:
            # item is (R, G, B, A)
            # Filter out dark pixels (background)
            # Keeping white/light pixels (the icon)
            # Threshold: if R, G, and B are all less than 100 (dark gray)
            if item[0] < 100 and item[1] < 100 and item[2] < 100:
                new_data.append((0, 0, 0, 0)) # Make transparent
            else:
                # Keep the pixel (it's likely part of the white icon)
                new_data.append(item)
                
        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Saved to {output_path}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python process_logo.py <input> <output>")
    else:
        remove_dark_background(sys.argv[1], sys.argv[2])
