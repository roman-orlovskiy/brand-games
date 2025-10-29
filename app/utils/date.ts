export function formatDateTimeRu(dateIsoString: string): string {
	const date = new Date(dateIsoString);
	if (Number.isNaN(date.getTime())) return "";
	return new Intl.DateTimeFormat("ru-RU", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	}).format(date);
}

export function formatDateRangeInclusiveRu(startIso: string, endIso: string): string {
	const start = new Date(startIso);
	const end = new Date(endIso);
	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";
	const d = new Intl.DateTimeFormat("ru-RU", { year: "numeric", month: "2-digit", day: "2-digit" });
	return `${d.format(start)} — ${d.format(end)}`;
}


