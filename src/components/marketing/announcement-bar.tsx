export function AnnouncementBar() {
  return (
    <div
      className="w-full border-b border-graphite-light bg-blackout bg-no-repeat"
      style={{
        backgroundImage: "url('/brand/announcement-bg.png')",
        backgroundSize: "100% 100%",
      }}
    >
      <div className="flex w-full items-center justify-center px-6 py-2.5 text-center">
        <p className="text-xs font-medium text-whiteout sm:text-sm">
          Tecnologia ESG para a agroindústria brasileira.
        </p>
      </div>
    </div>
  );
}
