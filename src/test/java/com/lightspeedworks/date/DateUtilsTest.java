package com.lightspeedworks.date;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtilsTest {

	public static void main(String[] args) {
		run(System.currentTimeMillis());
		run( DateUtils.valueOf("zzzzzzzz"));
		run( DateUtils.valueOf("zzzzzzzzz"));
		run( DateUtils.valueOf("zzzzzzzzzz"));
	}

	private static void run(long time) {
		String times = DateUtils.valueOf(time);
		System.out.println(times);
		System.out.println(time);
		System.out.println(DateUtils.valueOf(times));
		Date date = new Date(time);
		System.out.println(date.getTime());
		String dates = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss.SSS").format(date);
		System.out.println(dates);
		System.out.println();
	}

}
