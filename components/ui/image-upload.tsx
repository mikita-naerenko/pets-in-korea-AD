"use client";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";
import crypto from "crypto";
import { Article, News, Tag, Theme } from "@/lib/interfaces";

// import { cloudinaryConfig } from "@/lib/cloudinary-config";
// const cloudinary = require("cloudinary");

// cloudinary.v2.config(cloudinaryConfig);

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
  value: string[];
  editItem?: Theme | Article | News | Tag;
  editItemType?: "theme" | "article" | "news" | "tag";
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
  editItem,
  editItemType,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    console.log(result);
    onChange(result.info.secure_url);
  };

  // const handleRemove = async (url: string) => {
  //   // Remove the image from Cloudinary
  //   const publicId = url.split("/").pop()?.split(".")[0];
  //   if (publicId) {
  //     await cloudinary.v2.api
  //       .delete_resources([publicId])
  //       .then((res: Response) => console.log(res));
  //   }

  //   // Remove the image from UI
  //   onRemove(url);
  // };

  const generateSHA1 = (data: any) => {
    const hash = crypto.createHash("sha1");
    hash.update(data);
    return hash.digest("hex");
  };

  const generateSignature = (publicId: string, apiSecret: string) => {
    const timestamp = new Date().getTime();
    return `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  };

  const handleDeleteImage = async () => {
    const url = value[0];
    const publicId = url.split("/").pop()?.split(".")[0] || "";
    console.log(publicId);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const timestamp = new Date().getTime();
    const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
    const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY_SECRET || "";
    const signature = generateSHA1(generateSignature(publicId, apiSecret));
    const URL = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

    console.log(apiKey);

    try {
      const response = await axios.post(URL, {
        public_id: publicId,
        signature: signature,
        api_key: apiKey,
        timestamp: timestamp,
      });
      if (editItem && editItem?.images && editItem?.images[0]) {
        if (response.statusText === "OK" && editItemType) {
          const value = { id: editItem.images[0].id };
          const dbResponse = await axios.patch(
            `/api/image/${editItemType}`,
            value
          );
          console.log(`Deleted from db themeImage: ${dbResponse.status}`);
        }
      }

      console.log(`Deleted from cloudinary: ${response.status}`);
      onRemove(url);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="z-20">
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={handleDeleteImage}
                variant="destructive"
                size="sm"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="lxkaapob">
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <Button
              type="button"
              disabled={disabled}
              variant="secondary"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an Image
            </Button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
