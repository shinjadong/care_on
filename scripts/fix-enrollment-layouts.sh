#!/bin/bash

# Fix all enrollment components to have consistent padding structure
# This removes flex-1 flex flex-col structures that conflict with the layout

echo "Fixing enrollment component layouts..."

# List of components with flex-1 structure that need fixing
components=(
  "step-0-agreements.tsx"
  "step-1-owner-info.tsx"
  "step-1.5-welcome-tosspay.tsx"
  "step-2-contact-business.tsx"
  "step-3-store-info.tsx"
  "step-4-application-type.tsx"
  "step-4.5-delivery-app.tsx"
  "step-5-business-type.tsx"
  "step-6-ownership-type.tsx"
  "step-7-license-type.tsx"
  "step-8-business-category.tsx"
  "step-8.3-internet-cctv-check.tsx"
  "step-8.5-free-service.tsx"
  "step-9-confirmation.tsx"
)

for component in "${components[@]}"; do
  file="/home/tlswk/projects/careon/care_on/components/enrollment/$component"
  if [ -f "$file" ]; then
    echo "Processing $component..."

    # Replace flex-1 flex flex-col justify-start pt-XX px-6 with p-6
    sed -i 's/<div className="flex-1 flex flex-col justify-start pt-[0-9]* px-6">/<div className="p-6">/g' "$file"
    sed -i 's/<div className="flex-1 flex flex-col justify-start pt-[0-9]*px-6">/<div className="p-6">/g' "$file"

    # Also handle variations with different padding values
    sed -i 's/<div className="flex-1 flex flex-col justify-start pt-8 px-6">/<div className="p-6">/g' "$file"
    sed -i 's/<div className="flex-1 flex flex-col justify-start pt-12 px-6">/<div className="p-6">/g' "$file"
    sed -i 's/<div className="flex-1 flex flex-col justify-start pt-16 px-6">/<div className="p-6">/g' "$file"
  fi
done

echo "Layout fixes completed!"