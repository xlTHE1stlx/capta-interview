export function isInteger(value: unknown): boolean {
	return Number.isInteger(Number(value));
}

export function isPositive(value: unknown): boolean {
	return isInteger(value) && Number(value) > 0;
}

export function validDate(value: string): boolean {
	const iso8601Regex: RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?/;

	if (!iso8601Regex.test(value)) {
		return false;
	}

	try {
		const testDate: Date = new Date(value);
		return !isNaN(testDate.getTime());
	} catch {
		return false;
	}
}

export async function isHoliday(dateString: string): Promise<boolean> {
	async function getHolidays(): Promise<any> {
		const url = "https://content.capta.co/Recruitment/WorkingDays.json";
		const resp: Response = await fetch(url);
		if (!resp.ok) {
			throw new Error(`Error en la petición: ${resp.status} ${resp.statusText}`);
		}
		const data: any = await resp.json();
		return data;
	}
	const holidays: string[] = await getHolidays();
	const justDate: string | undefined = dateString.split("T")[0];
	if (!justDate) {
		return false;
	}
	return holidays.includes(justDate);
}
