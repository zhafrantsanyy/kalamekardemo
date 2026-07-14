export default function Thumb({ f, size = 44 }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={f.img}
      alt={f.nama}
      loading="lazy"
      draggable={false}
      style={{
        width: size, height: size, borderRadius: "50%", objectFit: "cover",
        display: "block", boxShadow: "0 2px 4px rgba(59,42,48,.22)",
      }}
    />
  );
}
