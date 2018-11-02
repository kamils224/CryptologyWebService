﻿using System;

namespace CryptoWebService.Models.VisualCryptography
{
    public class ImageDto 
    {
        public ImageDto(string imagePath)
        {
            this.ImagePath = imagePath;
            this.Width = 500;
            this.Height = 300;
            this.BorderWidth = 2;
            this.UnicNumber = Guid.NewGuid().ToString().Replace("-", string.Empty);
        }

        public string UnicNumber { get; }

        public string ImagePath { get; set; }

        public int Width { get; set; }

        public int Height { get; set; }

        public int TotalHeightWithBorders
        {
            get
            {
                return Height + (BorderWidth * 2);
            }
        }
        public int TotalWidthWithBorders
        {
            get
            {
                return Width + (BorderWidth * 2);
            }
        }
        
        public int BorderWidth { get; set; }
    }
}
