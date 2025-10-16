import { Temporal as tp } from "@js-temporal/polyfill";
import { isHoliday } from "./utils";

function getCurrentTimeForAPIClean(): tp.PlainDateTime {
	const currentTime: tp.ZonedDateTime = tp.Now.instant().toZonedDateTimeISO("America/Bogota");
	const isoString: string = currentTime.toString();
	let currentDateTime: tp.PlainDateTime = currentTime.toPlainDateTime();

	const match: RegExpMatchArray | null = isoString.match(
		/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/
	);

	if (match) {
		currentDateTime = tp.PlainDateTime.from(`${match[1]}`);
	}

	return currentDateTime;
}

function parseUserDate(dateString: string): tp.PlainDateTime {
	try {
		if (dateString.endsWith("Z")) {
			const instant = tp.Instant.from(dateString);
			return instant.toZonedDateTimeISO("America/Bogota").toPlainDateTime().add({ hours: 5 });
		}

		if (dateString.includes("T")) {
			const datetime: tp.PlainDateTime = tp.PlainDateTime.from(dateString);
			return datetime;
		}

		return tp.PlainDateTime.from(dateString);
	} catch (error) {
		throw new Error(`Fecha inválida: ${dateString}`);
	}
}

function getMinDateTime(date: tp.PlainDateTime): tp.PlainDateTime {
	return tp.PlainDateTime.from({
		year: date.year,
		month: date.month,
		day: date.day,
		hour: 8,
		minute: date.minute,
		second: date.second
	});
}

function getMaxDateTime(date: tp.PlainDateTime): tp.PlainDateTime {
	return tp.PlainDateTime.from({
		year: date.year,
		month: date.month,
		day: date.day,
		hour: 17,
		minute: date.minute,
		second: date.second
	});
}

function getLunchStartTime(date: tp.PlainDateTime): tp.PlainDateTime {
	return tp.PlainDateTime.from({
		year: date.year,
		month: date.month,
		day: date.day,
		hour: 12,
		minute: 0,
		second: 0
	});
}

function getLunchEndTime(date: tp.PlainDateTime): tp.PlainDateTime {
	return tp.PlainDateTime.from({
		year: date.year,
		month: date.month,
		day: date.day,
		hour: 13,
		minute: 0,
		second: 0
	});
}

function compareDates(date1: tp.PlainDateTime, date2: tp.PlainDateTime): number {
	return tp.PlainDateTime.compare(date1, date2);
}

async function addDays(date: tp.PlainDateTime, days: number): Promise<tp.PlainDateTime> {
	for (let i: number = 0; i < days; i++) {
		date = date.add({ days: 1 });
		while (date.dayOfWeek > 5 || (await isHoliday(date.toString()))) {
			date = date.add({ days: 1 });
		}
	}
	return date;
}

async function addHours(date: tp.PlainDateTime, hours_to_add: number): Promise<tp.PlainDateTime> {
	let leftTime: number | undefined = undefined;
	if (compareDates(date, getMinDateTime(date)) < 0) {
		leftTime = getMinDateTime(date).since(date, { largestUnit: "hours" }).hours;
		date = getMinDateTime(date);
	}

	if (
		compareDates(date, getLunchStartTime(date)) > 0 &&
		compareDates(date, getLunchEndTime(date)) < 0
	) {
		date = tp.PlainDateTime.from({
			year: date.year,
			month: date.month,
			day: date.day,
			hour: 12,
			minute: 0,
			second: 0
		});
	}

	if (
		compareDates(date.add({ hours: hours_to_add }), getLunchStartTime(date)) > 0 &&
		compareDates(date, getLunchEndTime(date)) < 0 &&
		compareDates(date, getLunchStartTime(date)) < 0
	) {
		date = date.add({ hours: 1 });
	}

	date = date.add({ hours: hours_to_add });

	if (compareDates(date, getMaxDateTime(date)) > 0) {
		leftTime = date.since(getMaxDateTime(date), { largestUnit: "hours" }).hours;
		date = await addDays(date, 1);
		date = getMinDateTime(date);
		date = await addHours(date, leftTime);
	}

	return date;
}

export function calculateWorkingDate(
	startDate: string | undefined,
	days: number,
	hours: number
): Promise<tp.Instant | undefined> {
	return new Promise(async (resolve: (value: tp.Instant | undefined) => void): Promise<void> => {
		let date: tp.ZonedDateTime | tp.PlainDateTime | undefined;
		if (!startDate) {
			date = getCurrentTimeForAPIClean();
		} else {
			date = parseUserDate(startDate);
		}

		if (days > 0) {
			date = await addDays(date, days);
		}
		if (hours >= 0) {
			date = await addHours(date, hours);
		}
		date = date.toZonedDateTime("America/Bogota");
		const bogotaTime: tp.ZonedDateTime = tp.ZonedDateTime.from(date.toString());
		date = bogotaTime.withTimeZone("UTC");
		const utcString: tp.Instant = date.toInstant();
		resolve(utcString);
		return;
	});
}
