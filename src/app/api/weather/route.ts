import { NextResponse } from "next/server";
import axios from "axios";

// 常量配置
const API_HOST = "nn4wcrw6gf.re.qweatherapi.com"; // 用户专属API Host

// 星期几中文表示
const DAYS_OF_WEEK = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

// 中国主要城市ID映射（用作备选，当API查询失败时使用）
const CITY_ID_MAP: { [key: string]: string } = {
  北京: "101010100",
  上海: "101020100",
  广州: "101280101",
  深圳: "101280601",
  杭州: "101210101",
  南京: "101190101",
  武汉: "101200101",
  成都: "101270101",
  重庆: "101040100",
  西安: "101110101",
  天津: "101030100",
  苏州: "101190401",
  厦门: "101230201",
};

// 和风天气响应接口 - 天气实况
interface WeatherNow {
  obsTime: string;
  temp: string;
  feelsLike: string;
  icon: string;
  text: string;
  wind360: string;
  windDir: string;
  windScale: string;
  windSpeed: string;
  humidity: string;
  precip: string;
  pressure: string;
  vis: string;
  cloud: string;
  dew: string;
}

interface WeatherNowResponse {
  code: string;
  updateTime: string;
  fxLink: string;
  now: WeatherNow;
  refer: {
    sources: string[];
    license: string[];
  };
}

// 和风天气响应接口 - 天气预报
interface DailyWeatherForecast {
  fxDate: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moonPhase: string;
  moonPhaseIcon: string;
  tempMax: string;
  tempMin: string;
  iconDay: string;
  textDay: string;
  iconNight: string;
  textNight: string;
  wind360Day: string;
  windDirDay: string;
  windScaleDay: string;
  windSpeedDay: string;
  wind360Night: string;
  windDirNight: string;
  windScaleNight: string;
  windSpeedNight: string;
  humidity: string;
  precip: string;
  pressure: string;
  vis: string;
  cloud: string;
  uvIndex: string;
}

interface WeatherForecastResponse {
  code: string;
  updateTime: string;
  fxLink: string;
  daily: DailyWeatherForecast[];
  refer: {
    sources: string[];
    license: string[];
  };
}

// 城市查询响应接口
interface CityLocation {
  name: string;
  id: string;
  lat: string;
  lon: string;
  adm2: string;
  adm1: string;
  country: string;
  tz: string;
  utcOffset: string;
  isDst: string;
  type: string;
  rank: string;
  fxLink: string;
}

interface GeoResponse {
  code: string;
  location: CityLocation[];
  refer: {
    sources: string[];
    license: string[];
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // 获取要查询的城市，默认为上海
  const city = searchParams.get("city") || "上海";

  // 使用和风天气 API
  const API_KEY = process.env.QWEATHER_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: "API密钥未配置" }, { status: 500 });
  }

  try {
    console.log(`查询城市天气: ${city}`);

    // 获取城市ID，尝试从预定义映射中获取（如果存在）
    let locationId = CITY_ID_MAP[city];
    let cityName = city;

    // 如果城市不在预定义映射中，则尝试通过GeoAPI查询
    if (!locationId) {
      try {
        console.log(`尝试使用城市搜索API查询: ${city}`);
        // 注意这里使用正确的城市搜索API路径：/geo/v2/city/lookup
        const geoApiUrl = `https://${API_HOST}/geo/v2/city/lookup?key=${API_KEY}&location=${encodeURIComponent(
          city
        )}&range=cn`;
        console.log(`城市搜索API请求: ${geoApiUrl}`);

        const locationResponse = await axios.get<GeoResponse>(geoApiUrl);

        if (
          locationResponse.data &&
          locationResponse.data.code === "200" &&
          locationResponse.data.location &&
          locationResponse.data.location.length > 0
        ) {
          // 成功获取城市ID
          locationId = locationResponse.data.location[0].id;
          cityName = locationResponse.data.location[0].name;
          console.log(
            `城市搜索成功，城市ID: ${locationId}, 城市名: ${cityName}`
          );
        } else {
          console.warn("城市搜索失败，无法找到城市");
          return NextResponse.json(
            { error: `找不到城市 "${city}" 的天气信息` },
            { status: 404 }
          );
        }
      } catch (geoError) {
        console.error("城市搜索API错误:", geoError);
        // 如果城市搜索失败，返回友好错误信息
        return NextResponse.json(
          { error: `无法搜索城市 "${city}"，请尝试其他城市名称` },
          { status: 500 }
        );
      }
    } else {
      console.log(`使用预定义城市ID: ${locationId} (${city})`);
    }

    if (!locationId) {
      console.error("无法获取城市ID");
      return NextResponse.json(
        { error: `找不到城市 "${city}" 的天气信息` },
        { status: 404 }
      );
    }

    // 获取实时天气
    console.log(`获取实时天气数据，城市ID: ${locationId}`);
    const nowWeatherUrl = `https://${API_HOST}/v7/weather/now?key=${API_KEY}&location=${locationId}`;
    console.log(`实时天气API请求: ${nowWeatherUrl}`);

    const nowWeatherResponse = await axios.get<WeatherNowResponse>(
      nowWeatherUrl
    );

    if (!nowWeatherResponse.data || nowWeatherResponse.data.code !== "200") {
      console.error("获取实时天气数据失败:", nowWeatherResponse.data);
      return NextResponse.json(
        { error: "获取实时天气数据失败" },
        { status: 500 }
      );
    }

    // 获取7天天气预报
    console.log(`获取天气预报数据，城市ID: ${locationId}`);
    const forecastUrl = `https://${API_HOST}/v7/weather/7d?key=${API_KEY}&location=${locationId}`;
    console.log(`天气预报API请求: ${forecastUrl}`);

    const forecastResponse = await axios.get<WeatherForecastResponse>(
      forecastUrl
    );

    if (!forecastResponse.data || forecastResponse.data.code !== "200") {
      console.error("获取天气预报数据失败:", forecastResponse.data);
      return NextResponse.json(
        { error: "获取天气预报数据失败" },
        { status: 500 }
      );
    }

    // 处理实时天气数据
    const nowWeather = nowWeatherResponse.data.now;

    // 处理天气预报数据
    const dailyForecast = forecastResponse.data.daily.map(
      (day: DailyWeatherForecast) => {
        const date = new Date(day.fxDate);
        return {
          date: day.fxDate,
          day: DAYS_OF_WEEK[date.getDay()],
          temp: {
            day: parseInt(day.tempMax),
            min: parseInt(day.tempMin),
            max: parseInt(day.tempMax),
          },
          humidity: parseInt(day.humidity),
          windSpeed: parseInt(day.windSpeedDay),
          weather: {
            description: day.textDay,
            icon: getWeatherIcon(day.iconDay),
          },
        };
      }
    );

    // 返回合并的数据
    return NextResponse.json({
      city: cityName,
      now: {
        temp: parseInt(nowWeather.temp),
        feelsLike: parseInt(nowWeather.feelsLike),
        humidity: parseInt(nowWeather.humidity),
        windSpeed: parseInt(nowWeather.windSpeed),
        weather: {
          description: nowWeather.text,
          icon: getWeatherIcon(nowWeather.icon),
        },
        updateTime: nowWeather.obsTime,
      },
      daily: dailyForecast,
    });
  } catch (error) {
    console.error("获取天气数据失败:", error);
    return NextResponse.json({ error: "获取天气数据失败" }, { status: 500 });
  }
}

// 和风天气图标映射到OpenWeatherMap图标格式以保持兼容性
function getWeatherIcon(iconCode: string): string {
  // 简单映射，可以根据需要扩展
  const iconMap: { [key: string]: string } = {
    "100": "01d", // 晴
    "101": "02d", // 多云
    "102": "03d", // 少云
    "103": "04d", // 晴间多云
    "104": "04d", // 阴
    "300": "09d", // 阵雨
    "301": "09d", // 强阵雨
    "302": "11d", // 雷阵雨
    "303": "11d", // 强雷阵雨
    "304": "11d", // 雷阵雨伴有冰雹
    "305": "10d", // 小雨
    "306": "10d", // 中雨
    "307": "10d", // 大雨
    "308": "10d", // 极端降雨
    "309": "09d", // 毛毛雨
    "310": "09d", // 暴雨
    "311": "09d", // 大暴雨
    "312": "09d", // 特大暴雨
    "313": "13d", // 冻雨
    "400": "13d", // 小雪
    "401": "13d", // 中雪
    "402": "13d", // 大雪
    "403": "13d", // 暴雪
    "404": "13d", // 雨夹雪
    "405": "13d", // 雨雪天气
    "406": "13d", // 阵雨夹雪
    "407": "13d", // 阵雪
  };

  return iconMap[iconCode] || "01d"; // 默认为晴天图标
}
