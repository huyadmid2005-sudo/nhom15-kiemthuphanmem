package com.vuong.analyticresearchservice.constants;

public class OpenAiConstants {
    public static final String GPT_MODEL = System.getenv("OPENAI_MODEL") != null
            ? System.getenv("OPENAI_MODEL") : "gpt-3.5-turbo";
    public static final String API_URL = System.getenv("OPENAI_API_URL") != null
            ? System.getenv("OPENAI_API_URL") : "https://api.openai.com/v1/chat/completions";
    public static final String API_KEY = System.getenv("OPENAI_API_KEY") != null
            ? System.getenv("OPENAI_API_KEY") : "";
}