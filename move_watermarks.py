import re

with open('src/components/company/pdf/ReportDocument.jsx', 'r') as f:
    content = f.read()

# Change zIndex back to 9999
content = content.replace("zIndex: 1,", "zIndex: 9999,")

# We want to move the watermarkContainer blocks to just before the closing </Page> tag
# But ONLY for the pages that currently have a watermarkContainer.
# Let's find each Page block that contains a watermarkContainer and move it.

# The pattern for a watermark container
watermark_pattern_10 = r'\s*<View style={styles.watermarkContainer} fixed>\n\s*<Image src="/icons/pdfLogocompanyWiki.png" style={styles.watermarkImage} />\n\s*</View>\n'
watermark_pattern_8 = r'\s*<View style={styles.watermarkContainer} fixed>\n\s*<Image src="/icons/pdfLogocompanyWiki.png" style={styles.watermarkImage} />\n\s*</View>\n'

# Wait, a safer way is just to regex out ALL watermarkContainers
content = re.sub(watermark_pattern_10, '\n', content)

# Now, we need to add the watermarkContainer right before the closing </Page> tag for all pages EXCEPT the first one.
# We can find all </Page> and replace them except the first one.
parts = content.split('</Page>')

# parts[0] is everything up to the first </Page>
# The first </Page> belongs to the Premium First Page. No watermark there.
new_content = parts[0] + '</Page>'

# For the rest of the pieces, we prepend the watermark Container except for the last part
for i in range(1, len(parts) - 1):
    # Depending on indentation of the part, we add matching indent. 
    # But let's just use 8 spaces for the watermark, it's fine React doesn't care.
    watermark_str = '\n        <View style={styles.watermarkContainer} fixed>\n          <Image src="/icons/pdfLogocompanyWiki.png" style={styles.watermarkImage} />\n        </View>\n      '
    # Actually let's just observe the trailing spaces before the split. 
    # `parts[i]` has the content of the next page up to its </Page>.
    # The spaces preceding `</Page>` were swallowed by the split? No, split doesn't swallow preceding spaces, it swallows literally `</Page>`.
    # Wait, the space before `</Page>` is usually `\n      ` or `\n        `.
    
    # Let's cleanly inject it:
    new_content += parts[i] + watermark_str + '</Page>'

new_content += parts[-1]

with open('src/components/company/pdf/ReportDocument.jsx', 'w') as f:
    f.write(new_content)
