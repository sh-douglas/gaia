export const allowedDoctorNoteExtensions: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

export const allowedDoctorNoteMimeTypes = new Set<string>(
  Object.keys(allowedDoctorNoteExtensions),
);
